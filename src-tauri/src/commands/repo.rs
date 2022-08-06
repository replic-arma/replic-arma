use crate::commands::a3s::download::{Downloader, HttpDownloader, HttpsDownloader};
use crate::commands::repo::check_a3s::check_a3s;
use crate::{
    repository::Repository,
    state::ReplicArmaState,
    util::{
        methods::save_t,
        types::{JSResult, RepoType},
    },
};
use anyhow::anyhow;
use anyhow::Result;
use filetime::FileTime;
use rayon::iter::{ParallelBridge, ParallelIterator};
use serde::{Deserialize, Serialize};
use sha1::{Digest, Sha1};
use std::{
    fs::{self, File},
    io::{self},
    path::{Path, PathBuf},
    str::FromStr,
    sync::Arc,
    time::Duration,
};
use tauri::{async_runtime::Mutex, Window};
use tokio::{task, time::sleep};
use url::Url;

use super::a3s::check_a3s;

#[derive(Serialize, Deserialize)]
pub struct FileCheckResult {
    pub complete: Vec<RepoFile>,
    pub outdated: Vec<RepoFile>,
    pub missing: Vec<RepoFile>,
    pub extra: Vec<RepoFile>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct RepoFile {
    pub file: String,
    pub size: u64,
    pub current_size: f64,
    pub percentage: f64,
}

#[tauri::command]
pub async fn file_check(
    repo_type: RepoType,
    path_prefix: String,
    file_input: Vec<FileCheckInput>,
    url: String,
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
) -> JSResult<FileCheckResult> {
    match repo_type {
        RepoType::A3S => check_a3s(path_prefix, file_input, url, window, state).await,
        RepoType::Swifty => todo!(),
    }
}

#[tauri::command]
pub async fn hash_check(
    window: Window,
    path_prefix: String,
    file_tuples: Vec<(String, String)>,
    state: tauri::State<'_, ReplicArmaState>,
) -> JSResult<(Vec<(String, String, i64)>, Vec<String>, Vec<String>)> {
    let mut known_hashes = state.known_hashes.lock().await;

    //let mut hashes: HashMap<String, (String, u128)> = read_t(state.data_dir.join("hashes.json"))?;
    let file_tuples_prefix: Vec<(String, String)> = file_tuples
        .iter()
        .map(|f| (format!("{}{}", path_prefix, f.0), f.1.clone()))
        .collect();

    let files: Vec<String> = file_tuples_prefix.iter().map(|f| f.0.clone()).collect();

    let mut hashes = known_hashes.clone();
    for file in files.iter() {
        hashes.entry(file.to_string()).or_insert((String::new(), 0));
    }
    let (new_hashes_res, _): (Vec<_>, Vec<_>) = hashes
        .into_iter()
        .par_bridge()
        .filter(|(file_name, _)| files.contains(file_name))
        .map(|hash| {
            let file = hash.0.clone();
            let res = check_update(hash.into());
            if let Ok(hash_tuple) = &res {
                window.emit("hash_calculated", hash_tuple).unwrap();
            } else {
                window.emit("hash_failed", file).unwrap();
            }
            res
        })
        .partition(|x| x.is_ok());
    let new_hashes: Vec<FileHash> = new_hashes_res.into_iter().map(Result::unwrap).collect();
    for hash in &new_hashes {
        known_hashes.insert(hash.path.clone(), (hash.hash.clone(), hash.time_modified));
    }
    save_t(&state.data_dir.join("hashes.json"), known_hashes.clone())?;

    let known_hashes = known_hashes.clone();

    let mut missing_files = Vec::with_capacity(files.capacity());
    for file in files.iter() {
        if !Path::new(&file).is_file() {
            missing_files.push(file.replacen(&path_prefix, "", 1));
        }
    }

    let mut outdated_files = Vec::with_capacity(files.capacity());
    for file in file_tuples_prefix.iter() {
        if let Some(kh_tuple) = known_hashes.get(&file.0) {
            if kh_tuple.0 != file.1 {
                outdated_files.push(file.0.clone());
            }
        }
    }

    let mut renameable_files: Vec<(String, String)> = Vec::new();
    for file_tuple in file_tuples_prefix.iter() {
        if let Some(renamed_file) = known_hashes.iter().find(|kvp| {
            kvp.1 .0 == file_tuple.1 && *kvp.0 != file_tuple.0 // && same_dir(&file_tuple.0, &*kvp.0)
        }) {
            renameable_files.push((file_tuple.0.clone(), renamed_file.0.clone()));
        }
    }

    // let result: Vec<_> = new_hashes
    //     .into_iter()
    //     .map(|kvp| {
    //         (
    //             kvp.path.replacen(&path_prefix, "", 1),
    //             kvp.hash,
    //             kvp.time_modified,
    //         )
    //     })
    //     .collect();

    // let mut renameable_files: Vec<String> = Vec::new();
    // for file_tuple in file_tuples {
    //     if let Some(fh) = result
    //         .iter()
    //         .find(|fh| fh.1 == file_tuple.1 && fh.0 != file_tuple.0)
    //     {
    //         renameable_files.push(fh.0.clone());
    //     }
    // }
    let result = Vec::<(String, String, i64)>::new();
    let renameable_files2 = Vec::<String>::new();
    // let s: Vec<_> = file_tuples
    //     .into_iter()
    //     .map(|file| if let Ok(fh) = result.iter().find(|fh| fh.1 == file.1) {})
    //     .collect();

    Ok((result, missing_files, renameable_files2))
}

// fn same_dir(file1: &str, file2: &str) -> bool {
//     let p1 = Path::new(file1);
//     let p2 = Path::new(file2);

//     p1.ancestors().eq(p2.ancestors())
// }

#[derive(Serialize, Deserialize)]
pub(crate) struct FileHash {
    pub path: String,
    pub hash: String,
    pub time_modified: i64,
    pub size: u64,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct KnownHash {
    pub path: String,
    pub hash: String,
    pub time_modified: i64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct FileCheckInput {
    pub file: String,
    pub hash: String,
    pub size: u64,
}

impl From<(String, (String, i64))> for KnownHash {
    fn from(tuple: (String, (String, i64))) -> Self {
        KnownHash {
            path: tuple.0,
            hash: tuple.1 .0,
            time_modified: tuple.1 .1,
        }
    }
}

pub(crate) fn check_update(known_hash: KnownHash) -> Result<FileHash> {
    let path = PathBuf::from(&known_hash.path);

    let meta = path.metadata()?;
    let time_modified = FileTime::from_last_modification_time(&meta).unix_seconds();
    let size = meta.len();

    if known_hash.time_modified < time_modified {
        Ok(FileHash {
            path: known_hash.path,
            hash: compute_hash(path)?,
            time_modified,
            size,
        })
        //(known_hash.0, compute_hash(path)?, time_modified, size))
    } else {
        Ok(FileHash {
            path: known_hash.path,
            hash: known_hash.hash,
            time_modified,
            size,
        })
        //Ok((known_hash.0, known_hash.1 .0, time_modified, size))
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
pub async fn pause_download(state: tauri::State<'_, ReplicArmaState>) -> JSResult<String> {
    if let Some(dl) = (&mut *state.downloading.lock().await).as_mut() {
        *dl = false;
    }
    Ok("pause_sent".to_owned())
}

#[tauri::command]
pub async fn download(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    repo_type: RepoType,
    url: String,
    target_path: String,
    file_array: Vec<String>,
) -> JSResult<String> {
    let dl_completed =
        download_wrapper(window, state, repo_type, url, target_path, file_array).await?;
    if dl_completed {
        Ok("completed".into())
    } else {
        Ok("paused".into())
    }
}

pub async fn download_wrapper(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    repo_type: RepoType,
    url: String,
    target_path: String,
    file_array: Vec<String>,
) -> Result<bool> {
    let target_dir = PathBuf::from_str(&target_path)?;
    download_files(window, state, repo_type, url, target_dir, file_array).await
}

async fn download_files(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    repo_type: RepoType,
    url: String,
    target_dir: PathBuf,
    file_array: Vec<String>,
) -> Result<bool> {
    return match repo_type {
        RepoType::A3S => download_a3s(window, state, url, target_dir, file_array).await,
        RepoType::Swifty => todo!(),
    };
}

async fn download_a3s(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    url: String,
    target_dir: PathBuf,
    files: Vec<String>,
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

    for file in files {
        let url = connection_info.join(&file)?;
        let target_file = target_dir.join(file.clone());
        let mut target_path = target_file.clone();
        target_path.pop();

        println!("Downloading: {} to {}", url, target_file.display());

        fs::create_dir_all(target_path)?;

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

    let mut dl_completed = false;
    if *downloading.lock().await {
        dl_completed = true;
    }

    *downloading.lock().await = false;

    Ok(dl_completed)
}
