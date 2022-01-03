#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[path = "./repos/a3s/mod.rs"]
mod a3s;
mod commands;
mod repository;
mod statemanager;
#[path = "./repos/swifty/mod.rs"]
mod swifty;
mod util;
use std::str::FromStr;

use crate::commands::repo::add_repo;
use crate::statemanager::dir_manager::{DirectoryManager, ModDirectory};
use crate::statemanager::repo_manger::RepoManager;
use crate::{a3s::A3SRepository, swifty::SwiftyRepository};
use directories::ProjectDirs;

use sha1::Digest;

use statemanager::state::ReplicArmaState;
use tauri::api::dialog::ask;
use tauri::async_runtime::Mutex;
use tauri::Event;
use tauri::Manager;
use util::types::JSResult;
use uuid::Uuid;

fn main() -> std::result::Result<(), Box<dyn std::error::Error>> {
    let a3s_repo = A3SRepository::from_auto_config(String::from(
        "http://a3s.gruppe-adler.de/mods/.a3s/autoconfig",
    ))?;

    let proj_dirs = ProjectDirs::from("", "", "replic-arma").unwrap();
    let x = 42u64;
    //println!("{}", proj_dirs.data_local_dir().to_str().unwrap());
    // let a3s_repo = A3SRepository::from_auto_config(String::from("ftp://195.201.245.42/opt/.a3s/autoconfig"))?;
    // let a3s_repo = A3SRepository::from_auto_config(String::from("https://repo.3commandobrigade.com/autoconfig"))?;
    let repo = a3s_repo.to_repository()?;
    println!("{}", repo.build_date);
    // let swifty = SwiftyRepository::from_repo_json(String::from("https://swifty.projectawesome.net/event/repo.json"));
    //repo.generate_file_map();
    let app = tauri::Builder::default()
        .manage(ReplicArmaState {
            repo_manger: Mutex::new(RepoManager::new(proj_dirs.data_local_dir().to_path_buf())),
        })
        .invoke_handler(tauri::generate_handler![add_repo])
        .build(tauri::generate_context!())
        .expect("error while running tauri application");
    //.run(tauri::generate_context!())
    //.expect("error while running tauri application");

    app.run(|app_handle, e| {
        if let Event::CloseRequested { label, api, .. } = e {
            let app_handle = app_handle.clone();
            let window = app_handle.get_window(&label).unwrap();
            // use the exposed close api, and prevent the event loop to close
            api.prevent_close();
            // ask the user if he wants to quit
            std::thread::spawn(move || {
                ask(
                    Some(&window),
                    "Tauri API",
                    "Are you sure that you want to close this window?",
                    move |answer| {
                        if answer {
                            // .close() cannot be called on the main thread
                            std::thread::spawn(move || {
                                app_handle.get_window(&label).unwrap().close().unwrap();
                            });
                        }
                    },
                );
            });
        }
    });

    println!("Done");
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

#[test]
fn test_manager() {
    let proj_dirs = ProjectDirs::from("", "", "replic-arma").unwrap();
    let mut m = RepoManager::new(proj_dirs.data_local_dir().to_path_buf());
    m.load();
    assert!(m
        .add("http://a3s.gruppe-adler.de/mods/.a3s/autoconfig".to_owned())
        .is_ok());
    assert!(m.save().is_ok());

    println!("{:?}", m.data_dir);
    println!(
        "{:?}",
        m.repos
            .get(&Uuid::from_str("cd3506bf-8ed2-4fb7-9021-3373e1493f81").unwrap())
            .unwrap()
            .get_url()
    );
}

#[test]
fn test_dir() {
    let proj_dirs = ProjectDirs::from("", "", "replic-arma").unwrap();
    let mut d = DirectoryManager::new(proj_dirs.data_local_dir().to_path_buf());

    let mut md = ModDirectory::new("L:\\RA_Test\\RATest".into());
    assert!(md.check().is_ok());

    d.dirs.insert(Uuid::new_v4(), md);
    assert!(d.save().is_ok());
}
