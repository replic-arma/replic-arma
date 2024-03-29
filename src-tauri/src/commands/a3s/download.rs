use std::fs::File;
use std::io::{BufReader, BufWriter, Read, Seek, SeekFrom, Write};
use std::path::Path;
use std::{path::PathBuf, sync::Arc, time::Duration};

use futures::StreamExt;
use rs_zsync::file_maker::FileMaker;
use tauri::{async_runtime::Mutex, Window};
use tokio::{fs, task, time::sleep};
use url::Url;

use anyhow::anyhow;
use anyhow::Result;

use crate::{
    commands::utils::download_client::{Downloader, HttpDownloader, HttpsDownloader},
    state::ReplicArmaState,
};

enum FileToDownload {
    NewFile(String),
    PartialFile(String),
}

use super::check_a3s::get_zsync;

pub async fn download_a3s(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    url: String,
    target_dir: PathBuf,
    new_files: Vec<String>,
    partial_files: Vec<String>,
    number_connections: usize,
) -> Result<bool> {
    let connection_info = Url::parse(&url)?;
    //println!("{:?}", files);
    println!("{}", connection_info);

    // Send/Sync required by tauri::command
    let downloader: Box<dyn Downloader> = match connection_info.scheme() {
        "http" => Box::new(HttpDownloader::new()),
        "https" => Box::new(HttpsDownloader::new()),
        "ftp" => todo!(),
        up => return Err(anyhow!("Unknown protocol/scheme: {}", up)),
    };

    *state.downloading.lock().await = Some(true);

    let downloading = Arc::new(Mutex::new(true));
    let written_bytes = Arc::new(Mutex::new(0_usize));

    let dl = downloading.clone();
    let wb = written_bytes.clone();
    let win = window.clone();
    task::spawn(async move {
        while *dl.lock().await {
            let bytes = *wb.lock().await;
            *wb.lock().await = 0;
            println!("KBytes per sec {}", bytes / 1000);
            win.emit("download_report", bytes / 1000).unwrap();
            sleep(Duration::from_millis(1000)).await;
        }
    });

    let mut files_to_dl: Vec<FileToDownload> = new_files
        .iter()
        .map(|f| FileToDownload::NewFile(f.to_string()))
        .collect();

    files_to_dl.extend(
        partial_files
            .iter()
            .map(|f| FileToDownload::PartialFile(f.to_string())),
    );

    if number_connections > 1 {
        let buffer = futures::stream::iter(files_to_dl)
            .map(|ftdl| {
                let downloading_state = state.downloading.clone();
                let connection_info = connection_info.clone();
                let target_dir = target_dir.clone();
                let downloader = downloader.clone_box();
                let written_bytes = written_bytes.clone();
                let window = window.clone();
                let downloading = downloading.clone();

                let fut_dl = download_file_match(
                    ftdl,
                    connection_info,
                    target_dir,
                    downloader,
                    downloading_state,
                    written_bytes,
                    window,
                    downloading,
                );

                tokio::spawn(fut_dl)
            })
            .buffer_unordered(number_connections);

        buffer
            .for_each(|r| async {
                match r {
                    Ok(_) => {}
                    Err(err) => println!("DL Error: {}", err),
                }
            })
            .await;
    } else {
        for file in new_files {
            dl_new_file(
                &connection_info,
                file,
                &target_dir,
                &downloader,
                &state.downloading,
                &written_bytes,
                &window,
                &downloading,
            )
            .await?;
        }

        for file in partial_files {
            dl_part_file(
                &connection_info,
                file,
                &target_dir,
                &downloader,
                &state.downloading,
                &written_bytes,
                &downloading,
                &window,
            )
            .await?;
        }
    }
    let mut dl_completed = false;
    if *downloading.lock().await {
        dl_completed = true;
    }

    *downloading.lock().await = false;

    Ok(dl_completed)
}

async fn download_file_match(
    ftdl: FileToDownload,
    connection_info: Url,
    target_dir: PathBuf,
    downloader: Box<dyn Downloader>,
    downloading_state: Arc<Mutex<Option<bool>>>,
    written_bytes: Arc<Mutex<usize>>,
    window: Window,
    downloading: Arc<Mutex<bool>>,
) -> Result<bool, anyhow::Error> {
    match ftdl {
        FileToDownload::NewFile(new_file) => {
            dl_new_file(
                &connection_info,
                new_file,
                &target_dir,
                &downloader,
                &downloading_state,
                &written_bytes,
                &window,
                &downloading,
            )
            .await
        }
        FileToDownload::PartialFile(part_file) => {
            dl_part_file(
                &connection_info,
                part_file,
                &target_dir,
                &downloader,
                &downloading_state,
                &written_bytes,
                &downloading,
                &window,
            )
            .await
        }
    }
}

async fn dl_part_file(
    connection_info: &Url,
    file: String,
    target_dir: &PathBuf,
    downloader: &Box<dyn Downloader>,
    downloading_state: &Arc<Mutex<Option<bool>>>,
    written_bytes: &Arc<Mutex<usize>>,
    downloading: &Arc<Mutex<bool>>,
    window: &Window,
) -> Result<bool, anyhow::Error> {
    let url = connection_info.join(&file)?;
    let fm = get_zsync_ranges(
        connection_info.as_str(),
        &file,
        target_dir.to_str().unwrap_or_default(),
    )
    .await?;
    let target_file = target_dir.join(file.clone());
    let mut part_file = target_file.to_str().unwrap_or_default().to_owned();

    let mut range_queue = false;
    let mut range_list = Vec::new();
    let mut range = 0;
    let mut data = Vec::new();

    part_file.push_str(".part");
    {
        let mut inp = BufReader::new(File::open(target_file.clone())?);

        let mut out = BufWriter::new(File::create(&part_file)?);

        let mut inner_buf = vec![0_u8; fm.metafile.blocksize];

        for (i, file_offset) in fm.file_map.iter().enumerate() {
            let file_offset = *file_offset;
            if file_offset != -1 {
                inner_buf.resize(fm.metafile.blocksize, 0);
                inp.seek(SeekFrom::Start(file_offset as u64))?;
                let n = inp.read(&mut inner_buf)?;
                inner_buf.resize(n, 0);
                out.write_all(&inner_buf)?;
            } else {
                if !range_queue {
                    range_list = fm.range_look_up(i);
                    if !range_list.is_empty() {
                        range_queue = true;
                    }
                    range = range_list.len();

                    let start_offset = range_list[0].0;
                    let end_offset = range_list[range_list.len() - 1].1;

                    dbg!(
                        "Partial download ({}) [{},{}]",
                        target_file.display(),
                        start_offset,
                        end_offset
                    );

                    data = downloader
                        .download_partial(
                            downloading_state,
                            written_bytes,
                            url.clone(),
                            (start_offset as usize, end_offset as usize),
                        )
                        .await?;

                    if data.is_empty() {
                        break;
                    }
                }

                if !(*downloading_state.lock().await).unwrap_or(true) {
                    *downloading.lock().await = false; // Should be already false???
                    break;
                }

                let block_length = FileMaker::calc_block_length(
                    i as i32,
                    fm.metafile.blocksize as i32,
                    fm.metafile.length as i32,
                );

                let offset = (range - range_list.len()) * fm.metafile.blocksize;

                if
                //offset >= 0 &&
                offset <= data.len()
                    && block_length >= 0
                    && block_length <= (data.len() as i32 - offset as i32)
                {
                    out.write_all(&data[offset..(offset + block_length as usize)])?;
                }

                range_list.remove(0);

                if range_list.is_empty() {
                    range_queue = false;
                }
            }
        }
    }
    if (*downloading_state.lock().await).unwrap_or(true) {
        fs::remove_file(&target_file).await?;
        fs::rename(part_file, target_file).await?;

        window.emit("download_finished", file).unwrap();
    } else {
        *downloading.lock().await = false; // Should be already false???
        return Ok(false);
    }
    Ok(true)
}

async fn dl_new_file(
    connection_info: &Url,
    file: String,
    target_dir: &PathBuf,
    downloader: &Box<dyn Downloader>,
    downloading_state: &Arc<Mutex<Option<bool>>>,
    written_bytes: &Arc<Mutex<usize>>,
    window: &Window,
    downloading: &Arc<Mutex<bool>>,
) -> Result<bool, anyhow::Error> {
    let url = connection_info.join(&file)?;
    let target_file = target_dir.join(file.clone());
    let mut target_path = target_file.clone();
    target_path.pop();
    println!("Downloading: {} to {}", url, target_file.display());
    fs::create_dir_all(target_path).await?;
    downloader
        .download_file(downloading_state, written_bytes, url, &target_file)
        .await?;
    if (*downloading_state.lock().await).unwrap_or(true) {
        window.emit("download_finished", file).unwrap();
    } else {
        *downloading.lock().await = false; // Should be already false???
        return Ok(false);
    }
    Ok(true)
}

pub async fn get_zsync_ranges(url: &str, file: &str, path_prefix: &str) -> Result<FileMaker> {
    let mut fm = get_zsync(url, file, path_prefix).await?;

    let mut file_path = path_prefix.to_string();
    file_path.push_str(file);

    fm.map_matcher(Path::new(&file_path));

    Ok(fm)
}
