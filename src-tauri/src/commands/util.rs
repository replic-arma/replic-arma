use std::path::Path;

use crate::util::types::JSResult;

#[tauri::command]
pub fn file_exists(path: String) -> JSResult<bool> {
    Ok(Path::new(&path).is_file())
}

#[tauri::command]
pub fn dir_exists(path: String) -> JSResult<bool> {
    Ok(Path::new(&path).is_dir())
}
