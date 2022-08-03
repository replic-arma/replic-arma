use std::path::Path;

use anyhow::anyhow;
use anyhow::Result;
use rayon::prelude::{ParallelBridge, ParallelIterator};
use rs_zsync::{file_maker::FileMaker, meta_file::MetaFile};
use tauri::Window;

use crate::{
    commands::repo::{check_update, FileCheckInput, FileCheckResult, FileHash, RepoFile},
    state::ReplicArmaState,
    util::{methods::save_t, types::JSResult},
};

use super::download::download_simple;

pub async fn check_a3s(
    path_prefix: String,
    file_input: Vec<FileCheckInput>,
    url: String,
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
) -> JSResult<FileCheckResult> {
    let mut known_hashes = state.known_hashes.lock().await;

    let mut file_input_prefixed: Vec<FileCheckInput> = Vec::with_capacity(file_input.len());
    file_input.into_iter().for_each(|f| {
        let mut f_p = f.clone();
        f_p.file = format!("{}{}", path_prefix, f.file);
        file_input_prefixed.push(f_p);
    });

    // let files: Vec<String> = file_tuples_prefix.iter().map(|f| f.0.clone()).collect();

    let mut hashes = known_hashes.clone();
    for file_input in file_input_prefixed.iter() {
        hashes
            .entry(file_input.file.clone())
            .or_insert((String::new(), 0));
    }

    let (new_hashes_res, _): (Vec<_>, Vec<_>) = hashes
        .into_iter()
        .par_bridge()
        .filter(|(file_name, _)| file_input_prefixed.iter().any(|fip| fip.file == *file_name))
        .map(|hash| {
            let file = hash.0.clone();
            let res = check_update(hash.into());

            if let Ok(hash_tuple) = &res {
                dbg!(&res.as_ref().ok().unwrap().path);
                window.emit("hash_calculated", hash_tuple).unwrap();
            } else {
                dbg!(&file);
                dbg!(res.as_ref().err().unwrap());
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

    let mut outdated_files = Vec::with_capacity(file_input_prefixed.capacity());
    let mut completed_files = Vec::with_capacity(file_input_prefixed.capacity());
    for file_input in file_input_prefixed.iter() {
        if let Some(kh_tuple) = known_hashes.get(&file_input.file) {
            let file_without_prefix = remove_prefix(file_input, &path_prefix);

            if kh_tuple.0 != file_input.hash {
                // hash doesn't match

                if let Ok(progress) = get_zsync(&url, &file_without_prefix, &path_prefix).await {
                    outdated_files.push(RepoFile {
                        file: file_without_prefix,
                        size: file_input.size,
                        current_size: progress.1,
                        percentage: progress.0,
                    });
                }
            } else {
                // hash matches
                completed_files.push(RepoFile {
                    file: file_without_prefix,
                    size: file_input.size,
                    percentage: 100.0,
                    current_size: file_input.size as f64,
                });
            }
        }
    }

    let missing_size: u64 = missing_files.iter().map(|f| f.size).sum();
    let outdated_size: f64 = outdated_files.iter().map(|f| f.current_size).sum();
    dbg!(missing_size);
    dbg!(outdated_size);
    dbg!(missing_size + outdated_size as u64);

    Ok(FileCheckResult {
        complete: completed_files,
        outdated: outdated_files,
        missing: missing_files,
        extra: Vec::new(),
    })
}

fn remove_prefix(file_input: &FileCheckInput, path_prefix: &String) -> String {
    file_input.file.replacen(path_prefix, "", 1)
}

async fn get_zsync(url: &str, file: &str, path_prefix: &str) -> Result<(f64, f64)> {
    let mut zsync_url = url.to_string();
    zsync_url.push_str(file);
    zsync_url.push_str(".zsync");

    let mut file_path = path_prefix.to_string();
    file_path.push_str(file);

    let mut zsync_path = file_path.clone();
    zsync_path.push_str(".zsync");
    let zsync_path = Path::new(&zsync_path);

    dbg!(&zsync_path);
    dbg!(&zsync_url);
    download_simple(&zsync_url, zsync_path).await?;

    let mut mf = MetaFile::new();
    if mf.parse_zsync(zsync_path).is_err() {
        return Err(anyhow!("Zsync parser error"));
    }
    let mut fm = FileMaker::new(&mf);
    dbg!(&file_path);
    let progress = fm.map_matcher(Path::new(&file_path));
    let remaining_size = fm.remaining_size(progress);

    Ok((progress, remaining_size))
}
