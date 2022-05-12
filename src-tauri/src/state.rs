use std::{collections::HashMap, path::PathBuf};

use tauri::async_runtime::Mutex;

pub struct ReplicArmaState {
    pub data_dir: Box<PathBuf>,
    pub known_hashes: Mutex<HashMap<String, (String, i64)>>,
    pub downloading: Mutex<Option<bool>>,
}

impl ReplicArmaState {}
