use std::path::Path;

use crate::util::types::JSResult;

#[tauri::command]
pub async fn file_exits(file_path: String) -> JSResult<bool> {
    Ok(Path::new(&file_path).is_file())
}

#[tauri::command]
pub async fn dir_exits(path: String) -> JSResult<bool> {
    Ok(Path::new(&path).is_dir())
}
