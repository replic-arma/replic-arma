use crate::commands::repo::check_a3s::check_a3s;
use crate::{
    state::ReplicArmaState,
    util::types::{JSResult, RepoType},
};
use ra_core::repository::Repository;
use anyhow::Result;
use std::{path::PathBuf, str::FromStr};
use tauri::Window;

use super::a3s::check_a3s;
use super::a3s::download::download_a3s;
use super::utils::types::{FileCheckInput, FileCheckResult, KnownHash};

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

impl From<(String, (String, i64))> for KnownHash {
    fn from(tuple: (String, (String, i64))) -> Self {
        KnownHash {
            path: tuple.0,
            hash: tuple.1 .0,
            time_modified: tuple.1 .1,
        }
    }
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
    new_files: Vec<String>,
    partial_files: Vec<String>,
    number_connections: u32,
) -> JSResult<String> {
    let dl_completed = download_wrapper(
        window,
        state,
        repo_type,
        url,
        target_path,
        new_files,
        partial_files,
        number_connections as usize,
    )
    .await?;
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
    new_files: Vec<String>,
    partial_files: Vec<String>,
    number_connections: usize,
) -> Result<bool> {
    let target_dir = PathBuf::from_str(&target_path)?;
    download_files(
        window,
        state,
        repo_type,
        url,
        target_dir,
        new_files,
        partial_files,
        number_connections,
    )
    .await
}

async fn download_files(
    window: Window,
    state: tauri::State<'_, ReplicArmaState>,
    repo_type: RepoType,
    url: String,
    target_dir: PathBuf,
    new_files: Vec<String>,
    partial_files: Vec<String>,
    number_connections: usize,
) -> Result<bool> {
    return match repo_type {
        RepoType::A3S => {
            download_a3s(
                window,
                state,
                url,
                target_dir,
                new_files,
                partial_files,
                number_connections,
            )
            .await
        }
        RepoType::Swifty => todo!(),
    };
}
