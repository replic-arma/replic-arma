#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod a3s;
mod repository;
mod swifty;
mod util;
use crate::{a3s::A3SRepository, swifty::SwiftyRepository};
use directories::ProjectDirs;
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let a3s_repo = A3SRepository::from_auto_config(String::from(
        "http://a3s.gruppe-adler.de/mods/.a3s/autoconfig",
    ))?;

    let proj_dirs = ProjectDirs::from("", "", "replic-arma").unwrap();

    println!("{}", proj_dirs.data_local_dir().to_str().unwrap());
    // let a3s_repo = A3SRepository::from_auto_config(String::from("ftp://195.201.245.42/opt/.a3s/autoconfig"))?;
    // let a3s_repo = A3SRepository::from_auto_config(String::from("https://repo.3commandobrigade.com/autoconfig"))?;
    let repo = a3s_repo.to_repository()?;
    println!("{}", repo.build_date);
    // let swifty = SwiftyRepository::from_repo_json(String::from("https://swifty.projectawesome.net/event/repo.json"));
    //repo.generate_file_map();
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[test]
fn test_swifty() {
    let swifty = SwiftyRepository::from_repo_json(String::from(
        "https://swifty.projectawesome.net/event/repo.json",
    ));

    assert_eq!(swifty.unwrap().repo_name, "Event".to_string());
}

#[test]
fn test_a3s() {
    let a3s = A3SRepository::from_auto_config(String::from(
        "http://a3s.gruppe-adler.de/mods/.a3s/autoconfig",
    ));

    assert_eq!(
        a3s.unwrap().auto_config.protocol.url,
        "a3s.gruppe-adler.de/mods".to_string()
    );
}
