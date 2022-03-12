use std::{
    fs::{self, File},
    io::{self},
    path::{Path, PathBuf},
    str::FromStr,
    sync::Arc,
    time::Duration,
};

use crate::{
    repository::Repository,
    state::ReplicArmaState,
    util::{
        download::{Downloader, HttpDownloader, HttpsDownloader},
        methods::save_t,
        types::{JSResult, RepoType},
    },
};
use anyhow::anyhow;
use anyhow::Result;
use filetime::FileTime;
use rayon::iter::{ParallelBridge, ParallelIterator};
use sha1::{Digest, Sha1};
use tauri::{async_runtime::Mutex, Window};
use tokio::{task, time::sleep};
use url::Url;

#[tauri::command]
pub async fn hash_check(
    window: Window,
    path_prefix: String,
    files: Vec<String>,
    state: tauri::State<'_, ReplicArmaState>,
) -> JSResult<(Vec<(String, String, i64)>, Vec<String>)> {
    let mut old_hashes = state.known_hashes.lock().await;

    //let mut hashes: HashMap<String, (String, u128)> = read_t(state.data_dir.join("hashes.json"))?;
    let mut hashes = old_hashes.clone();

    let files: Vec<String> = files
        .iter()
        .map(|f| format!("{}{}", path_prefix, f))
        .collect();

    // insert new files
    for file in files.iter() {
        hashes.entry(file.to_string()).or_insert((String::new(), 0));
    }

    let mut not_existing_files = Vec::with_capacity(files.capacity());
    for file in files.iter() {
        if !Path::new(&file).is_file() {
            not_existing_files.push(file.replacen(&path_prefix, "", 1));
        }
    }

    // calc Hash
    let (new_hashes_res, _): (Vec<_>, Vec<_>) = hashes
        .into_iter()
        .par_bridge()
        .filter(|(file_name, _)| files.contains(file_name))
        .map(|hash| {
            let file = hash.0.clone();
            let res = check_update(hash);
            if let Ok(hash_tuple) = &res {
                window.emit("hash_calculated", hash_tuple).unwrap();
            } else {
                window.emit("hash_failed", file).unwrap();
            }
            res
        })
        .partition(|x| x.is_ok());

    // partition into hashes and errors
    let new_hashes: Vec<(String, String, i64, u64)> =
        new_hashes_res.into_iter().map(Result::unwrap).collect();
    // let errors: Vec<String> = errors_res
    //     .into_iter()
    //     .map(|e| e.unwrap_err().to_string())
    //     .collect();

    // update HashMap
    for hash in &new_hashes {
        old_hashes.insert(hash.0.clone(), (hash.1.clone(), hash.2));
    }

    save_t(&state.data_dir.join("hashes.json"), old_hashes.clone())?;

    let result: Vec<_> = new_hashes
        .into_iter()
        .map(|kvp| (kvp.0.replacen(&path_prefix, "", 1), kvp.1, kvp.2))
        .collect();

    Ok((result, not_existing_files))
}

fn check_update(known_hash: (String, (String, i64))) -> Result<(String, String, i64, u64)> {
    let path = PathBuf::from(&known_hash.0);

    let meta = path.metadata()?;
    let time_modified = FileTime::from_last_modification_time(&meta).unix_seconds();
    let size = meta.len();

    if known_hash.1 .1 < time_modified {
        Ok((known_hash.0, compute_hash(path)?, time_modified, size))
    } else {
        Ok((known_hash.0, known_hash.1 .0, time_modified, size))
    }
}

fn compute_hash(path: PathBuf) -> Result<String> {
    let mut file = File::open(path)?;
    let mut hasher = Sha1::new();
    io::copy(&mut file, &mut hasher)?;

    Ok(hex::encode(hasher.finalize()))
}

#[tauri::command]
pub async fn get_repo(url: String) -> JSResult<Repository> {
    Ok(Repository::repo_from_url(url)?)
}

#[tauri::command]
pub async fn pause_download(state: tauri::State<'_, ReplicArmaState>) -> JSResult<()> {
    if let Some(dl) = (*state.downloader.lock().await).as_mut() {
        dl.pause().await;
    }
    Ok(())
}

#[tauri::command]
pub async fn download(
    window: Window,
    repo_type: RepoType,
    url: String,
    target_path: String,
    file_array: Vec<String>,
) -> JSResult<()> {
    Ok(download_wrapper(window, repo_type, url, target_path, file_array).await?)
}

pub async fn download_wrapper(
    window: Window,
    repo_type: RepoType,
    url: String,
    target_path: String,
    file_array: Vec<String>,
) -> Result<()> {
    let target_dir = PathBuf::from_str(&target_path)?;
    download_files(window, repo_type, url, target_dir, file_array).await?;
    Ok(())
}

async fn download_files(
    window: Window,
    repo_type: RepoType,
    url: String,
    target_dir: PathBuf,
    file_array: Vec<String>,
) -> Result<()> {
    match repo_type {
        RepoType::A3S => download_a3s(window, url, target_dir, file_array).await?,
        RepoType::Swifty => todo!(),
    };

    Ok(())
}

async fn download_a3s(
    window: Window,
    url: String,
    target_dir: PathBuf,
    files: Vec<String>,
) -> Result<()> {
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

    let downloading = Arc::new(Mutex::new(true));
    let written_bytes = Arc::new(Mutex::new(0_usize));

    let dl = downloading.clone();
    let wb = written_bytes.clone();
    let win = window.clone();
    task::spawn(async move {
        while *dl.lock().await {
            let bytes = *wb.lock().await;
            *wb.lock().await = 0;
            //println!("BBytes per sec {}", bytes / 1024 * 4);
            win.emit("download_report", bytes / 1024 * 4).unwrap();
            sleep(Duration::from_millis(250)).await;
        }
    });

    // NOT THREADSAFE (I think :P)
    //files.into_iter().for_each(|file| {
    for file in files {
        let url = connection_info.join(&file)?;
        let target_file = target_dir.join(file.clone());
        let mut target_path = target_file.clone();
        target_path.pop();

        println!("Downloading: {} to {}", url, target_file.display());

        fs::create_dir_all(target_path)?;
        downloader
            .download_file(&written_bytes, url, &target_file)
            .await?;
        window.emit("download_finished", file).unwrap();
        //});
    }

    *downloading.lock().await = false;

    Ok(())
}
