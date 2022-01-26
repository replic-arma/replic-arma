use std::{
    fs::File,
    io::{self, Write},
    path::{Path, PathBuf},
};

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
use hyper::{body::HttpBody, Client, Uri};
use hyper_tls::HttpsConnector;
use rayon::iter::{ParallelBridge, ParallelIterator};
use sha1::{Digest, Sha1};
use tauri::Window;
use url::Url;

#[tauri::command]
pub async fn hash_check(
    files: Vec<String>,
    state: tauri::State<'_, ReplicArmaState>,
    window: Window,
) -> JSResult<(Vec<(String, String, u128)>, Vec<String>)> {
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
    let new_hashes: Vec<(String, String, u128, u64)> =
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

fn check_update(known_hash: (String, (String, u128))) -> Result<(String, String, u128, u64)> {
    let path = PathBuf::from(&known_hash.0);

    let meta = path.metadata()?;
    let time_modified = meta.modified()?.elapsed()?.as_nanos();
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
pub async fn get_connection_info(url: String) -> JSResult<String> {
    let repo = Repository::repo_from_url(url)?;
    Ok(repo.download_server.url)
}

#[tauri::command]
pub async fn download(
    typ: RepoType,
    connection_info: String,
    target_path: String,
    file_array: Vec<String>,
) -> JSResult<()> {
    download_files(typ, connection_info, target_path, file_array).await?;
    Ok(())
}

async fn download_files(
    typ: RepoType,
    connection_info: String,
    target_path: String,
    file_array: Vec<String>,
) -> Result<()> {
    let target_path = PathBuf::from(target_path);
    let connection_info = Url::parse(&connection_info)?;

    match typ {
        RepoType::A3S => download_a3s(connection_info, target_path, file_array).await?,
        RepoType::Swifty => todo!(),
    };

    Ok(())
}

async fn download_a3s(
    connection_info: Url,
    target_path: PathBuf,
    files: Vec<String>,
) -> Result<()> {
    //let base_url = connection_info.clone();
    match connection_info.scheme() {
        "http" => {
            for file in files {
                download_file_http(connection_info.join(&file)?, &target_path).await?;
            }
        }
        "https" => {
            for file in files {
                download_file_https(connection_info.join(&file)?, &target_path).await?;
            }
        }
        "ftp" => {
            download_files_ftp().await?;
        }
        _ => return Err(anyhow!("scheme?")),
    };

    Ok(())
}

async fn download_file_http(url: Url, target_path: &Path) -> Result<()> {
    let client = hyper::Client::new();

    let mut res = client.get(url.as_str().parse::<Uri>()?).await?;
    let mut out = File::create(target_path)?;
    // let mut hash = Sha1::new();
    let mut _write_size: usize = 0;

    while let Some(next) = res.data().await {
        let chunk = next?;
        _write_size += out.write(&chunk)?;
        // hash.update(&chunk);
    }

    // let sha1 = hash.finalize();
    Ok(())
}

async fn download_file_https(url: Url, target_path: &Path) -> Result<()> {
    let https = HttpsConnector::new();
    let client = Client::builder().build::<_, hyper::Body>(https);

    let mut res = client.get(url.as_str().parse::<Uri>()?).await?;
    let mut out = File::create(target_path)?;
    // let mut hash = Sha1::new();
    let mut _write_size: usize = 0;

    while let Some(next) = res.data().await {
        let chunk = next?;
        _write_size += out.write(&chunk)?;
        // hash.update(&chunk);
    }

    // let sha1 = hash.finalize();
    Ok(())
}

async fn download_files_ftp() -> Result<()> {
    todo!()
}

// async fn download_file(url: hyper::Uri, out_path: PathBuf) -> anyhow::Result<()> {
//     let client = hyper::Client::new();

//     println!("Uri: {}", url);

//     let mut res = client.get(url).await?;

//     println!("Response: {}", res.status());
//     println!("Headers: {:#?}\n", res.headers());

//     let mut out = File::create(out_path)?;
//     let mut hash = Sha1::new();

//     let mut _write_size: usize = 0;

//     // Stream the body, writing each chunk to stdout as we get it
//     // (instead of buffering and printing at the end).
//     while let Some(next) = res.data().await {
//         let chunk = next?;
//         _write_size += out.write(&chunk)?;
//         hash.update(&chunk);
//         //io::stdout().write_all(&chunk).await?;
//     }

//     let sha1 = hash.finalize();
//     println!("\n\nDone! SHA1: {:02X?}", sha1);

//     Ok(())
// }
