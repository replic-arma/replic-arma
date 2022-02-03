use std::{
    fs::{self, File},
    io::{self},
    path::PathBuf,
    str::FromStr,
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
use tauri::Window;
use url::Url;

#[tauri::command]
pub async fn hash_check(
    window: Window,
    files: Vec<String>,
    state: tauri::State<'_, ReplicArmaState>,
) -> JSResult<(Vec<(String, String, i64)>, Vec<String>)> {
    let mut old_hashes = state.known_hashes.lock().await;

    //let mut hashes: HashMap<String, (String, u128)> = read_t(state.data_dir.join("hashes.json"))?;
    let mut hashes = old_hashes.clone();

    // insert new files
    for file in files {
        hashes.entry(file).or_insert((String::new(), 0));
    }

    // calc Hash
    let (new_hashes_res, errors_res): (Vec<_>, Vec<_>) = hashes
        .into_iter()
        .par_bridge()
        .map(|hash| {
            let file = hash.0.clone();
            let res = check_update(hash);
            //window.emit("hash_calculated", file).unwrap();
            res
        })
        .partition(|x| x.is_ok());

    // partition into hashes and errors
    let new_hashes: Vec<(String, String, i64, u64)> =
        new_hashes_res.into_iter().map(Result::unwrap).collect();
    let errors: Vec<String> = errors_res
        .into_iter()
        .map(|e| e.unwrap_err().to_string())
        .collect();

    // update HashMap
    for hash in &new_hashes {
        old_hashes.insert(hash.0.clone(), (hash.1.clone(), hash.2));
    }

    save_t(state.data_dir.join("hashes.json"), old_hashes.clone())?;

    let result: Vec<_> = new_hashes
        .into_iter()
        .map(|kvp| (kvp.0, kvp.1, kvp.2))
        .collect();

    Ok((result, errors))
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
pub async fn download(
    repo: Repository,
    target_path: String,
    file_array: Vec<String>,
) -> JSResult<()> {
    Ok(download_wrapper(repo, target_path, file_array).await?)
}

pub async fn download_wrapper(
    repo: Repository,
    target_path: String,
    file_array: Vec<String>,
) -> Result<()> {
    let target_dir = PathBuf::from_str(&target_path)?;
    download_files(repo, target_dir, file_array).await?;
    Ok(())
}

async fn download_files(
    repo: Repository,
    target_dir: PathBuf,
    file_array: Vec<String>,
) -> Result<()> {
    match repo.repo_typ {
        RepoType::A3S => download_a3s(repo, target_dir, file_array).await?,
        RepoType::Swifty => todo!(),
    };

    Ok(())
}

async fn download_a3s(repo: Repository, target_dir: PathBuf, files: Vec<String>) -> Result<()> {
    let connection_info = Url::parse(&repo.download_server.url)?;
    //println!("{:?}", files);
    println!("{}", connection_info);

    // Send/Sync required by tauri::command
    let downloader: Box<dyn Downloader + Send + Sync> = match connection_info.scheme() {
        "http" => Box::new(HttpDownloader::new()),
        "https" => Box::new(HttpsDownloader::new()),
        "ftp" => todo!(),
        up => return Err(anyhow!("Unknown protocol/scheme: {}", up)),
    };

    // NOT THREADSAFE (I think :P)
    //files.into_iter().for_each(|file| {
    for file in files {
        let url = connection_info.join(&file)?;
        let target_file = target_dir.join(file);
        let mut target_path = target_file.clone();
        target_path.pop();

        println!("Downloading: {} to {}", url, target_file.display());

        fs::create_dir_all(target_path)?;
        downloader.download_file(url, &target_file).await?;
        //});
    }

    Ok(())
}
