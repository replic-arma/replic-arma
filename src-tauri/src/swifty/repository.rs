use crate::a3s::utils::{fetch};
use serde_json::{Result, Value};
use serde::{Deserialize, Serialize};
use std::str;
use std::collections::HashMap;
#[derive(Debug, Serialize, Deserialize)]
pub struct SwiftyRepository {
    pub repo_name: String,
    pub required_mods: Vec<Mod>,
    pub optional_mods: Vec<Mod>,
    pub icon_image_path: String,
    pub icon_image_checksum: String,
    pub repo_image_path: String,
    pub repo_image_checksum: String,
    pub version: String,
    pub checksum: String,
    pub client_parameters: String,
    pub servers: Vec<Server>,
}

impl SwiftyRepository {
    pub fn from_repo_json(url: String) -> Result<SwiftyRepository> {
        let repo_json = fetch(url).unwrap();
        let repo_map: HashMap<String, Value> = serde_json::from_slice(repo_json.as_slice()).unwrap();
        let repo_name: String = repo_map["repoName"].as_str().unwrap().to_string();
        let icon_image_path: String = repo_map["iconImagePath"].as_str().unwrap().to_string();
        let icon_image_checksum: String = repo_map["iconImageChecksum"].as_str().unwrap().to_string();
        let repo_image_path: String = repo_map["repoImagePath"].as_str().unwrap().to_string();
        let repo_image_checksum: String = repo_map["repoImageChecksum"].as_str().unwrap().to_string();
        let version: String = repo_map["version"].as_str().unwrap().to_string();
        let client_parameters: String = repo_map["clientParameters"].as_str().unwrap().to_string();
        let checksum: String = repo_map["checksum"].as_str().unwrap().to_string();
        let required_mods: Vec<Mod> = Mod::from_repo_json(repo_map["requiredMods"].as_array().unwrap())?;
        let optional_mods: Vec<Mod> = Mod::from_repo_json(repo_map["optionalMods"].as_array().unwrap())?;
        let servers: Vec<Server> = Server::from_repo_json(repo_map["servers"].as_array().unwrap())?;

        return Ok(SwiftyRepository{repo_name, icon_image_path, icon_image_checksum, repo_image_path, repo_image_checksum, version, client_parameters, checksum, required_mods, optional_mods, servers});
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Mod {
    pub mod_name: String,
    pub check_sum: String,
    pub enabled: bool,
}

impl Mod {
    fn from_repo_json(arr:&Vec<Value>) -> Result<Vec<Mod>>{
        let mut result = Vec::<Mod>::new();
        for i in 0..arr.len() as usize{
            let tmp_mod = arr[i].as_object().unwrap();
            let mod_name: String = tmp_mod["modName"].as_str().unwrap().to_string();
            let check_sum: String = tmp_mod["checkSum"].as_str().unwrap().to_string();
            let enabled: bool = tmp_mod["enabled"].as_bool().unwrap();
            result.push(Mod{mod_name, check_sum, enabled});
        }
    
        return Ok(result);
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Server {
    pub name: String,
    pub address: String,
    pub port: String,
    pub password: String,
    pub battle_eye: bool,
}

impl Server {
    fn from_repo_json(arr:&Vec<Value>) -> Result<Vec<Server>>{
        let mut result = Vec::<Server>::new();
        for i in 0..arr.len() as usize{
            let tmp_server = arr[i].as_object().unwrap();
            let name: String = tmp_server["name"].as_str().unwrap().to_string();
            let address: String = tmp_server["address"].as_str().unwrap().to_string();
            let port: String = tmp_server["port"].as_str().unwrap().to_string();
            let password: String = tmp_server["password"].as_str().unwrap().to_string();
            let battle_eye: bool = tmp_server["battleEye"].as_bool().unwrap();
            result.push(Server{name, address, port, password, battle_eye});
        }
    
        return Ok(result);
    }
}