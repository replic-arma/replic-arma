use anyhow::anyhow;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::a3s::A3SRepository;
use crate::swifty::SwiftyRepository;
use crate::util::types::RepoType;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Repository {
    pub id: Uuid,
    pub config_url: String,
    pub connection_info: String,
    #[serde(rename = "type")]
    pub repo_typ: RepoType,
    pub open_repository_schema: u32,
    pub name: String,
    pub build_date: i64,
    //#[serde(skip)]
    pub files: Vec<File>,
    //#[serde(skip)]
    pub modsets: Vec<Modset>,
    pub game_servers: Vec<GameServer>,
    pub download_server: DownloadServer,
}

impl std::fmt::Display for Repository {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "Repository \"{}\" from {} (includes {} files, {} modsets and {} game servers)",
            self.name,
            self.build_date,
            self.files.len(),
            self.modsets.len(),
            self.game_servers.len()
        )
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct File {
    pub path: String,
    pub size: i64,
    pub sha1: String,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Modset {
    pub name: String,
    pub description: String,
    pub mods: Vec<ModsetMod>,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModsetMod {
    pub mod_type: String,
    pub name: String,
    pub allow_compat: Option<bool>,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GameServer {
    pub name: String,
    pub host: String,
    pub port: String,
    pub password: String,
    pub modset: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DownloadServer {
    pub url: String,
    pub options: DownloadServerOptions,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DownloadServerOptions {
    pub max_connections: i32,
}
#[derive(Debug, Serialize, Deserialize, Clone)]
struct FileMap {
    foreign_hash: String,
    local_hash: String,
    file_found: bool,
}

impl Repository {
    // pub fn generate_file_map(self: Repository) {
    //     let file_map = Arc::new(RwLock::new(HashMap::<std::path::PathBuf, FileMap>::new()));

    //     let start = Instant::now();

    //     let base_dir = Path::new("E:/SteamLibrary/steamapps/common/Arma 3/Mods/");

    //     //let len = self.files.len();
    //     let files = self.files; //.clone();
    //     let pool = ThreadPool::new(8);

    //     for file in files {
    //         let abs_path = base_dir.join(file.path.clone());

    //         if fs::metadata(&abs_path).is_ok() {
    //             let file_map = file_map.clone();

    //             pool.execute(move || {
    //                 let now = Instant::now();
    //                 let local_hash = self::create_hash_from_file(&abs_path).unwrap();
    //                 let mut list = file_map.write().unwrap();
    //                 println!(
    //                     "finished {:?} in {}ms ({})",
    //                     &abs_path.file_name().unwrap(),
    //                     now.elapsed().as_millis(),
    //                     local_hash
    //                 );
    //                 list.insert(
    //                     abs_path,
    //                     FileMap {
    //                         foreign_hash: file.sha1,
    //                         local_hash,
    //                         file_found: true,
    //                     },
    //                 );
    //             });
    //         } else {
    //             let mut list = file_map.write().unwrap();
    //             list.insert(
    //                 abs_path,
    //                 FileMap {
    //                     foreign_hash: file.sha1,
    //                     local_hash: String::from(""),
    //                     file_found: false,
    //                 },
    //             );
    //         }
    //     }

    //     pool.join();
    //     let file_map = file_map.write().unwrap();

    //     println!("Finished in {}s", start.elapsed().as_secs());
    //     println!("{:?}", file_map);
    // }

    pub fn repo_from_url(url: String) -> anyhow::Result<Repository> {
        let repo: Repository;
        if url.ends_with("autoconfig") {
            repo = A3SRepository::from_auto_config(url)?.to_repository();
        } else if url.ends_with(".json") {
            repo = SwiftyRepository::from_repo_json(url)?.to_repository();
        } else {
            return Err(anyhow!("Unknown repo url: {}", url));
        }
        Ok(repo)
    }
}

// pub fn create_hash_from_file<P: AsRef<Path>>(
//     path: P,
// ) -> Result<String, Box<dyn std::error::Error>> {
//     let mut file = fs::File::open(&path)?;

//     let buf_size = std::cmp::min(file.metadata()?.len(), 4 * 1024 * 1024) as usize;
//     let mut vec = vec![0_u8; buf_size];
//     let mut buf = vec.as_mut_slice();

//     let mut digest = Sha1::new();

//     loop {
//         let size = file.read(&mut buf)?;
//         if size == 0 {
//             break;
//         };

//         if size < buf_size {
//             digest.update(&buf[..size]);
//         } else {
//             digest.update(&buf);
//         }
//     }

//     let hash = format!("{:x}", digest.finalize());
//     Ok(hash)
// }

impl<T: Repo> From<T> for Repository {
    fn from(t: T) -> Self {
        t.to_repository()
    }
}

pub trait Repo {
    fn get_url(&self) -> String;
    fn get_type(&self) -> RepoType;
    fn to_repository(&self) -> Repository;
}
