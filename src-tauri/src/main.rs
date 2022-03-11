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
use crate::commands::repo::get_repo;
use crate::commands::repo::hash_check;
use crate::commands::util::dir_exists;
use crate::commands::util::file_exists;
use crate::commands::util::get_a3_dir;
use directories::ProjectDirs;
use tauri::async_runtime::Mutex;
use util::methods::load_t;

use state::ReplicArmaState;
use windows::Win32::{
    Foundation::{HINSTANCE, HWND, LPARAM, LRESULT, RECT, WPARAM},
    UI::{
        Input::KeyboardAndMouse::SetFocus,
        WindowsAndMessaging::{
            CallNextHookEx, GetWindowRect, GetWindowThreadProcessId, SetWindowPos,
            SetWindowsHookExW, CWPSTRUCT, HHOOK, MSG, SWP_NOMOVE, WH_CALLWNDPROC, WH_GETMESSAGE,
            WM_MOVE, WM_NCLBUTTONDOWN,
        },
    },
};

fn init_state() -> anyhow::Result<ReplicArmaState> {
    let proj_dirs = Box::new(
        ProjectDirs::from("", "", "replic-arma")
            .unwrap()
            .data_local_dir()
            .to_owned(),
    );

    let hashes: HashMap<String, (String, i64)> = load_t(proj_dirs.join("hashes.json"))?;

    let state = ReplicArmaState {
        data_dir: proj_dirs,
        known_hashes: Mutex::new(hashes),
    };

    Ok(state)
}

unsafe extern "system" fn get_msg_callback(code: i32, w_param: WPARAM, l_param: LPARAM) -> LRESULT {
    let msg = *(l_param.0 as *mut MSG);
    if msg.message == WM_NCLBUTTONDOWN {
        SetFocus(msg.hwnd);
    }
    CallNextHookEx(HHOOK(0), code, w_param, l_param)
}

unsafe extern "system" fn call_wnd_callback(
    code: i32,
    w_param: WPARAM,
    l_param: LPARAM,
) -> LRESULT {
    let cwp = *(l_param.0 as *mut CWPSTRUCT);
    if cwp.message == WM_MOVE {
        let mut rect = RECT::default();
        if GetWindowRect(cwp.hwnd, &mut rect as *mut RECT).as_bool() {
            let width = rect.right - rect.left;
            let height = rect.bottom - rect.top;

            SetWindowPos(cwp.hwnd, HWND(0), 0, 0, width + 1, height + 1, SWP_NOMOVE);
            SetWindowPos(cwp.hwnd, HWND(0), 0, 0, width, height, SWP_NOMOVE);
        }
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
    tauri::Builder::default()
        .manage(init_state()?)
        .invoke_handler(tauri::generate_handler![
            hash_check,
            get_repo,
            download,
            file_exists,
            dir_exists,
            get_a3_dir
        ])
        .on_page_load(|window, _| {
            if let Ok(hwnd) = window.hwnd() {
                unsafe {
                    let hwnd_win = HWND(hwnd as isize);
                    let thread_id = GetWindowThreadProcessId(hwnd_win, std::ptr::null_mut());
                    SetWindowsHookExW(
                        WH_GETMESSAGE,
                        Some(get_msg_callback),
                        HINSTANCE::default(),
                        thread_id,
                    );
                    SetWindowsHookExW(
                        WH_CALLWNDPROC,
                        Some(call_wnd_callback),
                        HINSTANCE::default(),
                        thread_id,
                    );
                }
            }
            println!("Test");
        })
        .on_window_event(|event| {
            if let tauri::WindowEvent::Moved(_) = event.event() {
                // let win = event.window();
                // TODO: call NotifyParentWindowPositionChanged here
                // https://github.com/MicrosoftEdge/WebView2Feedback/issues/780#issuecomment-808306938
                // https://docs.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2controller?view=webview2-1.0.774.44#notifyparentwindowpositionchanged
            }
        })
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

        download(
            a3s.repo_typ,
            a3s.download_server.url.clone(),
            ".\\test_out\\".to_string(),
            a3s.files[0..5]
                .into_iter()
                .map(|f| f.path.clone())
                .collect(),
        )
        .await
        .unwrap();

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
