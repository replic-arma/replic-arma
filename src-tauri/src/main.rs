#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod a3s;
mod repository;
mod swifty;
use crate::a3s::{A3SRepository};
use crate::swifty::{SwiftyRepository};
use tauri::api::notification::Notification;
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let a3s_repo = A3SRepository::from_auto_config(String::from("http://a3s.gruppe-adler.de/mods/.a3s/autoconfig"))?;
    // let a3s_repo = A3SRepository::from_auto_config(String::from("ftp://195.201.245.42/opt/.a3s/autoconfig"))?;
    // let a3s_repo = A3SRepository::from_auto_config(String::from("https://repo.3commandobrigade.com/autoconfig"))?;
    let repo = a3s_repo.to_repository()?;
    println!("{}", repo);
    // let swifty = SwiftyRepository::from_repo_json(String::from("https://swifty.projectawesome.net/event/repo.json"));
    repo.generate_file_map();
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    return Ok(());
}