use uuid::Uuid;

use crate::{statemanager::state::ReplicArmaState, util::types::JSResult};

#[tauri::command]
pub async fn add_repo(url: String, state: tauri::State<'_, ReplicArmaState>) -> JSResult<Uuid> {
    Ok(state.repo_manger.lock().await.add(url)?)
    //Ok(Uuid::new_v4())
}
