use crate::a3s::utils::fetch;
use crate::repository::Repo;
use crate::util::types::Result;
use serde::{Deserialize, Serialize};
use std::str;

#[derive(Debug, Serialize, Deserialize)]
pub struct SwiftyRepository {
    #[serde(rename = "repoName")]
    pub repo_name: String,
    #[serde(rename = "requiredMods")]
    pub required_mods: Vec<Mod>,
    #[serde(rename = "optionalMods")]
    pub optional_mods: Vec<Mod>,
    #[serde(rename = "iconImagePath")]
    pub icon_image_path: String,
    #[serde(rename = "iconImageChecksum")]
    pub icon_image_checksum: String,
    #[serde(rename = "repoImagePath")]
    pub repo_image_path: String,
    #[serde(rename = "repoImageChecksum")]
    pub repo_image_checksum: String,
    pub version: String,
    pub checksum: String,
    #[serde(rename = "clientParameters")]
    pub client_parameters: String,
    pub servers: Vec<Server>,
}

impl SwiftyRepository {
    pub fn from_repo_json(url: String) -> Result<SwiftyRepository> {
        let repo_json: SwiftyRepository = serde_json::from_slice(&fetch(url)?)?;
        Ok(repo_json)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Mod {
    #[serde(rename = "modName")]
    pub mod_name: String,
    #[serde(rename = "checkSum")]
    pub check_sum: String,
    pub enabled: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Server {
    pub name: String,
    pub address: String,
    pub port: String,
    pub password: String,
    #[serde(rename = "battleEye")]
    pub battle_eye: bool,
}

impl Repo for SwiftyRepository {
    fn get_url(&self) -> String {
        todo!()
    }

    fn get_type(&self) -> crate::util::types::RepoType {
        todo!()
    }

    fn to_repository(&self) -> crate::repository::Repository {
        todo!()
    }
}
