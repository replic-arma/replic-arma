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
    pub revision: i32,
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
