use anyhow::anyhow;
use std::path::Path;
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

use crate::util::types::JSResult;

#[tauri::command]
pub async fn file_exists(path: String) -> JSResult<bool> {
    Ok(Path::new(&path).is_file())
}

#[tauri::command]
pub async fn dir_exists(path: String) -> JSResult<bool> {
    Ok(Path::new(&path).is_dir())
}

// https://feedback.bistudio.com/T82461
#[tauri::command]
pub async fn get_a3_dir() -> JSResult<String> {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

    if let Ok(bis_key) = hklm.open_subkey("SOFTWARE\\WOW6432Node\\Bohemia Interactive\\arma 3") {
        if let Ok(bis_key_main) = bis_key.get_value::<String, _>("main") {
            return Ok(bis_key_main);
        }
    }

    Err(anyhow!("Arma 3 dir could not be found!").into())
}
