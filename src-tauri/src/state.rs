use std::{collections::HashMap, path::PathBuf, sync::Arc};

use tauri::async_runtime::Mutex;

pub struct ReplicArmaState {
    pub data_dir: Box<PathBuf>,
    pub known_hashes: Mutex<HashMap<String, (String, i64)>>,
    pub downloading: Arc<Mutex<Option<bool>>>,
    pub number_hash_concurrent: Arc<Mutex<usize>>,
    pub number_dl_concurrent: Arc<Mutex<usize>>,
}

impl ReplicArmaState {}
