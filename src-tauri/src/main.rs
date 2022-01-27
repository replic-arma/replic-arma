#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[path = "./repos/a3s/mod.rs"]
mod a3s;
mod commands;
mod repository;
mod state;
#[path = "./repos/swifty/mod.rs"]
mod swifty;
mod util;

use std::collections::HashMap;

use crate::commands::repo::download;
use crate::commands::repo::get_connection_info;
use crate::commands::repo::get_repo;
use crate::commands::repo::hash_check;
use crate::commands::util::dir_exists;
use crate::commands::util::file_exists;
use directories::ProjectDirs;
use tauri::async_runtime::Mutex;
use util::methods::load_t;

use state::ReplicArmaState;
use tauri::api::dialog::ask;
use tauri::Event;
use tauri::Manager;

fn init_state() -> anyhow::Result<ReplicArmaState> {
    let proj_dirs = Box::new(
        ProjectDirs::from("", "", "replic-arma")
            .unwrap()
            .data_local_dir()
            .to_owned(),
    );

    let hashes: HashMap<String, (String, u128)> = load_t(proj_dirs.join("hashes.json"))?;

    let state = ReplicArmaState {
        data_dir: proj_dirs,
        known_hashes: Mutex::new(hashes),
    };

    Ok(state)
}

fn main() -> std::result::Result<(), Box<dyn std::error::Error>> {
    // let a3s_repo = A3SRepository::from_auto_config(String::from(
    //     "http://a3s.gruppe-adler.de/mods/.a3s/autoconfig",
    // ))?;

    // let proj_dirs = ProjectDirs::from("", "", "replic-arma").unwrap();
    //let x = 42u64;
    //println!("{}", proj_dirs.data_local_dir().to_str().unwrap());
    // let a3s_repo = A3SRepository::from_auto_config(String::from("ftp://195.201.245.42/opt/.a3s/autoconfig"))?;
    // let a3s_repo = A3SRepository::from_auto_config(String::from("https://repo.3commandobrigade.com/autoconfig"))?;
    // let repo = a3s_repo.to_repository();
    // println!("{}", repo.build_date);
    // let swifty = SwiftyRepository::from_repo_json(String::from("https://swifty.projectawesome.net/event/repo.json"));
    //repo.generate_file_map();

    // Init State

    let app = tauri::Builder::default()
        .manage(init_state())
        .invoke_handler(tauri::generate_handler![
            hash_check,
            get_repo,
            get_connection_info,
            download,
            file_exists,
            dir_exists
        ])
        // .build(tauri::generate_context!())
        // .expect("error while running tauri application")
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // app.run(|app_handle, e| {
    //     if let Event::CloseRequested { label, api, .. } = e {
    //         let app_handle = app_handle.clone();
    //         let window = app_handle.get_window(&label).unwrap();
    //         // use the exposed close api, and prevent the event loop to close
    //         api.prevent_close();
    //         // ask the user if he wants to quit
    //         std::thread::spawn(move || {
    //             ask(
    //                 Some(&window),
    //                 "Tauri API",
    //                 "Are you sure that you want to close this window?",
    //                 move |answer| {
    //                     if answer {
    //                         // .close() cannot be called on the main thread
    //                         std::thread::spawn(move || {
    //                             app_handle.get_window(&label).unwrap().close().unwrap();
    //                         });
    //                     }
    //                 },
    //             );
    //         });
    //     }
    // });

    println!("Done");
    Ok(())
}

#[cfg(test)]
mod tests {

    use crate::{
        a3s::A3SRepository,
        commands::{
            repo::{get_connection_info, get_repo},
            util::{dir_exists, file_exists},
        },
        swifty::SwiftyRepository,
    };

    #[test]
    fn test_swifty() {
        let swifty = SwiftyRepository::from_repo_json(String::from(
            "https://swifty.projectawesome.net/event/repo.json",
        ));

        //assert_eq!(swifty.unwrap().repo_name, "Event".to_string());
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

    #[tokio::test]
    async fn test_get_a3s() {
        let a3s = get_repo("http://a3s.gruppe-adler.de/mods/.a3s/autoconfig".to_string())
            .await
            .unwrap();

        println!("{}", a3s.download_server.url);
    }

    #[tokio::test]
    async fn test_get_a3s_conn_info() {
        let a3s_url =
            get_connection_info("http://a3s.gruppe-adler.de/mods/.a3s/autoconfig".to_string())
                .await
                .unwrap();

        println!("{}", a3s_url);
    }

    #[test]
    fn dir_exists_test() {
        assert!(dir_exists("./src".to_string()).unwrap());
    }

    #[test]
    fn dir_not_exists_test() {
        assert!(!dir_exists("./src/1337".to_string()).unwrap());
    }

    #[test]
    fn file_exists_test() {
        assert!(file_exists("./src/main.rs".to_string()).unwrap());
    }

    #[test]
    fn file_not_exists_test() {
        assert!(!file_exists("./src/main".to_string()).unwrap());
    }
}
