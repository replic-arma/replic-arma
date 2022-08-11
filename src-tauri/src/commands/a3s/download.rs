use std::fs::{File, OpenOptions};
use std::io::{BufReader, BufWriter, Read, Seek, SeekFrom, Write};
use std::os::windows::prelude::FileExt;
use std::path::Path;
use std::{path::PathBuf, sync::Arc, time::Duration};

use rs_zsync::file_maker::FilePart;
use rs_zsync::meta_file::MetaFile;
use tauri::{async_runtime::Mutex, Window};
use tokio::{fs, task, time::sleep};
use url::Url;

use anyhow::anyhow;
use anyhow::Result;

use crate::{
    commands::utils::download_client::{Downloader, HttpDownloader, HttpsDownloader},
    state::ReplicArmaState,
};

use super::check_a3s::get_zsync;

pub async fn download_a3s(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    url: String,
    target_dir: PathBuf,
    new_files: Vec<String>,
    partial_files: Vec<String>,
) -> Result<bool> {
    let connection_info = Url::parse(&url)?;
    //println!("{:?}", files);
    println!("{}", connection_info);

    // Send/Sync required by tauri::command
    let downloader: Box<dyn Downloader + Send + Sync> = match connection_info.scheme() {
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

    // NOT THREADSAFE (I think :P)
    //files.into_iter().for_each(|file| {

    for file in new_files {
        let url = connection_info.join(&file)?;
        let target_file = target_dir.join(file.clone());
        let mut target_path = target_file.clone();
        target_path.pop();

        println!("Downloading: {} to {}", url, target_file.display());

        fs::create_dir_all(target_path).await?;

        downloader
            .download_file(&state, &written_bytes, url, &target_file)
            .await?;
        if (*state.downloading.lock().await).unwrap_or(true) {
            window.emit("download_finished", file).unwrap();
        } else {
            *downloading.lock().await = false; // Should be already false???
            break;
        }
    }

    for file in partial_files {
        let url = connection_info.join(&file)?;
        let (ranges, mf) = get_zsync_ranges(
            connection_info.as_str(),
            &file,
            target_dir.to_str().unwrap_or_default(),
        )
        .await?;
        let target_file = target_dir.join(file.clone());

        let mut part_file = target_file.to_str().unwrap_or_default().to_owned();
        part_file.push_str(".part");
        {
            let mut inp = BufReader::new(File::open(target_file.clone())?);

            let mut out = BufWriter::new(File::create(&part_file)?);

            let mut inner_buf = vec![0_u8; mf.blocksize];

            for range in ranges {
                if range.file_offset != -1 {
                    inner_buf.resize(mf.blocksize, 0);
                    inp.seek(SeekFrom::Start(range.file_offset as u64))?;
                    let n = inp.read(&mut inner_buf)?;
                    inner_buf.resize(n, 0);
                    out.write_all(&inner_buf)?;
                } else {
                    let buf = downloader
                        .download_partial(
                            &state,
                            &written_bytes,
                            url.clone(),
                            (range.start_offset, range.end_offset),
                        )
                        .await?;
                    if !(*state.downloading.lock().await).unwrap_or(true) {
                        *downloading.lock().await = false; // Should be already false???
                        break;
                    }

                    out.write_all(&buf)?;
                }

                // out.write_all()
            }
        }
        if (*state.downloading.lock().await).unwrap_or(true) {
            fs::remove_file(&target_file).await?;
            fs::rename(part_file, target_file).await?;

            window.emit("download_finished", file).unwrap();
        } else {
            *downloading.lock().await = false; // Should be already false???
            break;
        }
    }

    let mut dl_completed = false;
    if *downloading.lock().await {
        dl_completed = true;
    }

    *downloading.lock().await = false;

    Ok(dl_completed)
}

pub async fn get_zsync_ranges(
    url: &str,
    file: &str,
    path_prefix: &str,
) -> Result<(Vec<FilePart>, MetaFile)> {
    let mut fm = get_zsync(url, file, path_prefix).await?;

    let mut file_path = path_prefix.to_string();
    file_path.push_str(file);

    fm.map_matcher(Path::new(&file_path));

    Ok((fm.file_maker(), fm.metafile))
}
