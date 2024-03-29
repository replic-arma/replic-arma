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
use std::fs;
use std::path::PathBuf;
use std::sync::Arc;
use std::thread::available_parallelism;

use crate::commands::repo::file_check;
use crate::commands::{
    discord::discord_set_activity,
    repo::{download, get_repo, pause_download},
    util::{dir_exists, file_exists, get_a3_dir},
};
use log::LevelFilter;
use tauri::{api::path::app_dir, async_runtime::Mutex, Manager};
use tauri_plugin_log::LogTarget;
use util::methods::load_t;

use declarative_discord_rich_presence::DeclarativeDiscordIpcClient;
use state::ReplicArmaState;

#[cfg(target_os = "windows")]
use windows::Win32::{
    Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, WPARAM},
    UI::{
        Input::KeyboardAndMouse::SetFocus,
        WindowsAndMessaging::{
            CallNextHookEx, GetWindowThreadProcessId, SetWindowsHookExW, HHOOK, MSG, WH_GETMESSAGE,
            WM_NCLBUTTONDOWN,
        },
    },
};

fn init_state(app_dir: PathBuf) -> anyhow::Result<ReplicArmaState> {
    let file_path = app_dir.join("hashes.json");
    println!(
        "Using app dir path: {}",
        file_path.to_str().unwrap_or_default()
    );
    let hashes_load_result: anyhow::Result<HashMap<String, (String, i64)>> = load_t(&file_path);

    let hashes = match hashes_load_result {
        Ok(hashes) => hashes,
        Err(_) => {
            if file_path.is_file() {
                if let Err(err) = fs::remove_file(file_path) {
                    println!("Error {}", err);
                }
            }
            HashMap::<String, (String, i64)>::new()
        }
    };

    let num_logical_cores = available_parallelism().unwrap().get();

    let state = ReplicArmaState {
        data_dir: Box::new(app_dir),
        known_hashes: Mutex::new(hashes),
        downloading: Arc::new(Mutex::new(None)),
        number_hash_concurrent: Arc::new(Mutex::new(num_logical_cores)),
    };

    Ok(state)
}

#[cfg(target_os = "windows")]
unsafe extern "system" fn get_msg_callback(code: i32, w_param: WPARAM, l_param: LPARAM) -> LRESULT {
    let msg = *(l_param.0 as *mut MSG);
    if msg.message == WM_NCLBUTTONDOWN {
        SetFocus(msg.hwnd);
    }
    CallNextHookEx(HHOOK(0), code, w_param, l_param)
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
    // let app =

    tauri_plugin_deep_link::prepare("replic-arma");

    tauri::Builder::default()
        .setup(move |app| {
            let app_dir = app_dir(&app.config()).expect("Couldn't get app dir path!");
            app.manage(init_state(app_dir.clone()).unwrap_or_else(|_| {
                println!("Error during init state! Using default state!");
                let num_logical_cores = available_parallelism().unwrap().get();
                ReplicArmaState {
                    data_dir: Box::new(app_dir),
                    known_hashes: Mutex::new(HashMap::new()),
                    downloading: Arc::new(Mutex::new(None)),
                    number_hash_concurrent: Arc::new(Mutex::new(num_logical_cores)),
                }
            }));
            let handle = app.handle();
            tauri_plugin_deep_link::register("replicarma", move |request| {
                dbg!(&request);
                handle.emit_all("scheme-request-received", request).unwrap();
            })
            .unwrap();
            app.manage(DeclarativeDiscordIpcClient::new(&String::from(
                "1027352671289622580",
            )));
            let client = app.state::<DeclarativeDiscordIpcClient>();
            client.enable();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_repo,
            download,
            pause_download,
            file_exists,
            dir_exists,
            get_a3_dir,
            file_check,
            discord_set_activity
        ])
        .on_page_load(|window, _| {
            #[cfg(target_os = "windows")]
            if let Ok(hwnd) = window.hwnd() {
                unsafe {
                    let hwnd_win = HWND(hwnd.0 as isize);
                    let thread_id = GetWindowThreadProcessId(hwnd_win, std::ptr::null_mut());
                    SetWindowsHookExW(
                        WH_GETMESSAGE,
                        Some(get_msg_callback),
                        HINSTANCE::default(),
                        thread_id,
                    );
                }
            }
        })
        .on_window_event(|event| {
            if let tauri::WindowEvent::Moved(_) = event.event() {
                let win = event.window();
                win.with_webview(|webview| {
                    #[cfg(target_os = "linux")]
                    {}

                    #[cfg(windows)]
                    unsafe {
                        // https://github.com/MicrosoftEdge/WebView2Feedback/issues/780#issuecomment-808306938
                        // https://docs.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2controller?view=webview2-1.0.774.44#notifyparentwindowpositionchanged
                        webview
                            .controller()
                            .NotifyParentWindowPositionChanged()
                            .unwrap();
                    }

                    #[cfg(target_os = "macos")]
                    unsafe {}
                });
            }
        })
        .plugin(
            tauri_plugin_log::Builder::default()
                .level(LevelFilter::Info)
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
                .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepAll)
                .build(),
        )
        // .build(tauri::generate_context!())
        // .expect("error while running tauri application")
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // app.run(|app_handle, e| {
    //     EventHandl
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

    // urls:
    // grad: http://a3s.gruppe-adler.de/mods/.a3s/autoconfig
    // opt: http://repo.opt4.net/opt/.a3s/autoconfig

    use std::{path::PathBuf, str::FromStr};

    use crate::{
        a3s::A3SRepository,
        commands::{
            repo::{download, get_repo},
            util::{dir_exists, file_exists, get_a3_dir},
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

    #[test]
    fn test_a3s_3cb() {
        let a3s = A3SRepository::from_auto_config(String::from(
            "http://repo.3commandobrigade.com/autoconfig",
        ));

        assert!(a3s.is_ok());

        assert!(a3s.unwrap().auto_config.protocol.url == "repo.3commandobrigade.com");
    }

    #[test]
    fn test_a3s_402() {
        let a3s = A3SRepository::from_auto_config(String::from(
            "http://repo.pzgrenbtl402.de/main/.a3s/autoconfig",
        ));

        assert!(a3s.is_ok());

        assert!(a3s.unwrap().auto_config.protocol.url == "repo.pzgrenbtl402.de/main");
    }

    #[tokio::test]
    async fn test_get_a3s() {
        let a3s = get_repo("http://a3s.gruppe-adler.de/mods/.a3s/autoconfig".to_string())
            .await
            .unwrap();

        println!("{}", a3s.download_server.url);
    }

    #[tokio::test]
    async fn dir_exists_test() {
        assert!(dir_exists("./src".to_string()).await.unwrap());
    }

    #[tokio::test]
    async fn dir_not_exists_test() {
        assert!(!dir_exists("./src/1337".to_string()).await.unwrap());
    }

    #[tokio::test]
    async fn file_exists_test() {
        assert!(file_exists("./src/main.rs".to_string()).await.unwrap());
    }

    #[tokio::test]
    async fn file_not_exists_test() {
        assert!(!file_exists("./src/main".to_string()).await.unwrap());
    }

    #[tokio::test]
    async fn test_download_a3s() {
        let a3s = get_repo("http://a3s.gruppe-adler.de/mods/.a3s/autoconfig".to_string())
            .await
            .unwrap();

        // download(
        //     a3s.repo_typ,
        //     a3s.download_server.url.clone(),
        //     "L:\\Repos\\rust\\replic-arma\\src-tauri\\test_out".to_string(),
        //     a3s.files[0..5]
        //         .into_iter()
        //         .map(|f| f.path.clone())
        //         .collect(),
        // )
        // .await
        // .unwrap();

        //println!("{}", a3s.download_server.url);
    }

    #[tokio::test]
    async fn get_a3_dir_test() {
        let a3_dir = get_a3_dir().await.unwrap();
        let path = PathBuf::from_str(&a3_dir).unwrap();
        println!("Arma 3 dir: {}", path.display());

        assert!(path.is_dir());
    }
}
