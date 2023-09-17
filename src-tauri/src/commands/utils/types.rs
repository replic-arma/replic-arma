use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct FileCheckResult {
    pub complete: Vec<RepoFile>,
    pub outdated: Vec<RepoFile>,
    pub missing: Vec<RepoFile>,
    pub extra: Vec<RepoFile>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct RepoFile {
    pub file: String,
    pub size: u64,
    pub current_size: f64,
    pub percentage: f64,
}

#[derive(Serialize, Deserialize)]
pub struct FileHash {
    pub path: String,
    pub hash: String,
    pub time_modified: i64,
    pub size: u64,
}

#[derive(Serialize, Deserialize)]
pub struct KnownHash {
    pub path: String,
    pub hash: String,
    pub time_modified: i64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FileCheckInput {
    pub file: String,
    pub hash: String,
    pub size: u64,
}
