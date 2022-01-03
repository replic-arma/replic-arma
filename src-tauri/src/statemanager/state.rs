use tauri::async_runtime::Mutex;

use crate::statemanager::repo_manger::RepoManager;

pub struct ReplicArmaState {
    pub repo_manger: Mutex<RepoManager>,
    //pub data_dir: PathBuf,
}
