use std::{collections::HashMap, path::PathBuf};

use tauri::async_runtime::Mutex;

use crate::util::download::Downloader;
pub struct ReplicArmaState {
    pub data_dir: Box<PathBuf>,
    pub known_hashes: Mutex<HashMap<String, (String, i64)>>,
    pub downloader: Mutex<Option<Box<dyn Downloader + Send + Sync>>>,
}

impl ReplicArmaState {}
