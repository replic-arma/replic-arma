use std::path::Path;

use anyhow::anyhow;
use anyhow::Result;
use futures::future;
use rayon::prelude::{ParallelBridge, ParallelIterator};
use rs_zsync::{file_maker::FileMaker, meta_file::MetaFile};
use tauri::Window;
use tokio::fs;

use crate::commands::utils::download_client::download_simple;
use crate::commands::utils::hash::check_update;
use crate::commands::utils::types::FileCheckInput;
use crate::commands::utils::types::FileCheckResult;
use crate::commands::utils::types::FileHash;
use crate::commands::utils::types::RepoFile;
use crate::{
    state::ReplicArmaState,
    util::{methods::save_t, types::JSResult},
};

pub async fn check_a3s(
    path_prefix: String,
    file_input: Vec<FileCheckInput>,
    url: String,
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
) -> JSResult<FileCheckResult> {
    let mut known_hashes = state.known_hashes.lock().await;

    known_hashes.retain(|file, _| Path::new(&file).exists());

    // for file in file_input.clone() {
    //     if file.file.ends_with("cba_settings.sqf") {
    //         dbg!("File Input: {:?}", file.clone());
    //     }
    // }

    // add path  to every file name
    let mut file_input_prefixed: Vec<FileCheckInput> = Vec::with_capacity(file_input.len());
    file_input.into_iter().for_each(|f| {
        let mut f_p = f.clone();
        f_p.file = format!("{}{}", path_prefix, f.file);
        file_input_prefixed.push(f_p);
    });

    // add new files into HashMap
    let mut hashes = known_hashes.clone();
    for file_input in file_input_prefixed.iter() {
        if hashes.contains_key(&file_input.file) {
            if !Path::new(&file_input.file).exists() {
                dbg!(&file_input.file);
                hashes.remove(&file_input.file);
            }
        } else {
            hashes.insert(file_input.file.clone(), (String::new(), 0));
        }
    }

    // calc hashes
    let (new_hashes_res, _): (Vec<_>, Vec<_>) = hashes
        .into_iter()
        .par_bridge()
        .filter(|(file_name, _)| file_input_prefixed.iter().any(|fip| fip.file == *file_name))
        .map(|hash| {
            let file = hash.0.clone();
            let res = check_update(hash.into());
            // dbg!(&file);
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

    // collect non existing files
    let mut missing_files = Vec::with_capacity(file_input_prefixed.capacity());
    for file_input in file_input_prefixed.iter() {
        if !Path::new(&file_input.file).is_file() {
            missing_files.push(RepoFile {
                file: remove_prefix(file_input, &path_prefix),
                size: file_input.size,
                percentage: 0.0,
                current_size: 0.0,
            });
        }
    }

    // partition into completed and outdated files (checks if hash is the same as in the repo)
    let (completed, outdated): (Vec<_>, Vec<_>) = file_input_prefixed
        .into_iter()
        .filter(|fci| known_hashes.contains_key(&fci.file))
        .map(|fci| (fci.clone(), known_hashes.get(&fci.file).unwrap()))
        .partition(|(fci, kh_tuple)| kh_tuple.0 == fci.hash);

    println!("Outdated: {:?}", outdated);

    window.emit("outdated_file_count", outdated.len()).unwrap();

    // collect completed files
    let completed_files: Vec<RepoFile> = completed
        .into_iter()
        .map(|(fci, _)| RepoFile {
            file: remove_prefix(&fci, &path_prefix),
            size: fci.size,
            percentage: 100.0,
            current_size: fci.size as f64,
        })
        .collect();

    // create zsync tasks for outdated files
    let zsync_tasks = outdated.into_iter().map(|(fci, _)| {
        let url2 = url.clone();
        let path_prefix2 = path_prefix.clone();
        let inner_window = window.clone();
        tokio::spawn(async move {
            let file_without_prefix = remove_prefix(&fci, &path_prefix2);

            if !Path::new(&fci.file).exists() || fci.size == 0 {
                return Ok(RepoFile {
                    file: file_without_prefix,
                    size: 0,
                    current_size: 0.0,
                    percentage: 0.0,
                });
            }

            if let Ok(progress) =
                get_zsync_progress(&url2, &file_without_prefix, &path_prefix2).await
            {
                inner_window
                    .emit("zsync_completed", file_without_prefix.clone())
                    .unwrap();
                Ok(RepoFile {
                    file: file_without_prefix,
                    size: fci.size,
                    current_size: progress.1,
                    percentage: progress.0,
                })
            } else {
                Err(anyhow!("Err"))
            }
        })
    });

    // collect outdated files via executing all the tasks
    let zsync_results = future::join_all(zsync_tasks).await;
    let outdated_files: Vec<RepoFile> = zsync_results
        .into_iter()
        .partition::<Vec<_>, _>(|x| x.is_ok() && x.as_ref().unwrap().is_ok())
        .0 // only successfull tasks
        .into_iter()
        .map(|f| f.unwrap().unwrap())
        .collect();

    let missing_size: u64 = missing_files.iter().map(|f| f.size).sum();
    let outdated_size: f64 = outdated_files.iter().map(|f| f.current_size).sum();
    let completed_size: u64 = completed_files.iter().map(|f| f.size).sum();
    println!("missing file sizes: {}", missing_size);
    println!("outdated file sizes: {}", outdated_size);
    println!("completed file sizes: {}", completed_size);
    println!(
        "missing + outdated file sizes: {}",
        missing_size + outdated_size as u64
    );
    println!(
        "missing + outdated + completed file sizes: {}",
        missing_size + outdated_size as u64 + completed_size
    );

    // dbg!(completed_files);
    println!("Outdated: {:?}", outdated_files);
    // println!("Missing: {:?}", missing_files);

    Ok(FileCheckResult {
        complete: completed_files,
        outdated: outdated_files,
        missing: missing_files,
        extra: Vec::new(),
    })
}

pub fn remove_prefix(file_input: &FileCheckInput, path_prefix: &String) -> String {
    file_input.file.replacen(path_prefix, "", 1)
}

pub async fn get_zsync_progress(url: &str, file: &str, path_prefix: &str) -> Result<(f64, f64)> {
    let mut fm = get_zsync(url, file, path_prefix).await?;

    let mut file_path = path_prefix.to_string();
    file_path.push_str(file);

    let progress = fm.map_matcher(Path::new(&file_path));
    let remaining_size = fm.remaining_size(progress);

    Ok((progress, remaining_size))
}

pub async fn get_zsync(
    url: &str,
    file: &str,
    path_prefix: &str,
) -> Result<FileMaker, anyhow::Error> {
    let mut zsync_url = url.to_string();
    zsync_url.push_str(file);
    zsync_url.push_str(".zsync");
    let mut file_path = path_prefix.to_string();
    file_path.push_str(file);
    let mut zsync_path = file_path.clone();
    zsync_path.push_str(".zsync");
    let zsync_path = Path::new(&zsync_path);
    // dbg!(&zsync_path);
    // dbg!(&zsync_url);
    download_simple(&zsync_url, zsync_path).await?;
    let mut mf = MetaFile::new();
    if mf.parse_zsync(zsync_path).is_err() {
        return Err(anyhow!("Zsync parser error"));
    }
    let mut fm = FileMaker::new(&mf);
    // dbg!(&file_path);

    if zsync_path.exists() {
        fs::remove_file(zsync_path).await;
    }
    Ok(fm)
}
