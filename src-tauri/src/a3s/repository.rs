use std::str::FromStr;

use url::Url;

use super::utils::fetch_java_object;
use crate::a3s::classes::{AutoConfig, Changelogs, Events, ServerInfo, SyncTreeDirectory};
use crate::repository::{
    DownloadServer, DownloadServerOptions, File, GameServer, Modset, ModsetMod, Repository,
};

#[derive(Debug)]
pub struct A3SRepository {
    pub auto_config: AutoConfig,
    pub changelogs: Changelogs,
    pub sync: SyncTreeDirectory,
    pub server_info: ServerInfo,
    pub events: Events,
}

impl A3SRepository {
    pub fn from_auto_config(
        autoconfig: String,
    ) -> Result<A3SRepository, Box<dyn std::error::Error>> {
        // let auto_config = unzip(fetch(url)?)?;
        // let parser = Parser::new(auto_config)?;
        // let auto_config = *AutoConfig::from_java_obj(auto_config.as_slice())?;
        let autoconfig_url = Url::from_str(&autoconfig)?;
        let auto_config: AutoConfig = fetch_java_object(autoconfig_url, None)?;

        let mut url_str: String = auto_config.protocol.protocol_type.to_string();
        url_str.push_str("://");
        url_str.push_str(&auto_config.protocol.url);
        url_str.push('/');
        url_str.push_str(super::A3S_FOLDER_NAME);
        url_str.push('/');

        let url = Url::from_str(&url_str)?;

        let changelogs: Changelogs =
            fetch_java_object(url.clone(), Some(super::CHANGELOGS_FILE_NAME))?;
        let sync: SyncTreeDirectory = fetch_java_object(url.clone(), Some(super::SYNC_FILE_NAME))?;
        let server_info: ServerInfo =
            fetch_java_object(url.clone(), Some(super::SERVERINFO_FILE_NAME))?;
        let events: Events = fetch_java_object(url, Some(super::EVENTS_FILE_NAME))?;

        Ok(A3SRepository {
            auto_config,
            changelogs,
            sync,
            server_info,
            events,
        })
    }

    pub fn to_repository(&self) -> Result<Repository, Box<dyn std::error::Error>> {
        // modsets
        let mut modsets = Vec::<Modset>::new();
        for event in self.events.events.list.iter() {
            let mut mods = Vec::<ModsetMod>::new();

            for (addon, _) in event.addon_names.hash_map.iter() {
                mods.push(ModsetMod {
                    mod_type: String::from("mod"),
                    name: addon.clone(),
                    allow_compat: None,
                });
            }

            modsets.push(Modset {
                name: event.name.clone(),
                description: event.description.clone(),
                mods,
            });
        }

        let mut files = Vec::<File>::new();
        let m = self.sync.flat(String::from(""));
        for (path, file) in m.iter() {
            files.push(File {
                path: path.clone(),
                size: file.size,
                sha1: file.sha1.clone(),
            });
        }

        let mut game_servers = Vec::<GameServer>::new();
        for server in self.auto_config.favorite_servers.list.iter() {
            game_servers.push(GameServer {
                host: server.ip_address.clone(),
                port: server.port.to_string(),
                password: server.password.clone(),
                name: server.name.clone(),
                modset: if server.modset_name.is_empty() {
                    None
                } else {
                    Some(server.modset_name.clone())
                },
            });
        }

        let download_server = DownloadServer {
            url: self.auto_config.protocol.url.clone(),
            options: DownloadServerOptions {
                max_connections: self.server_info.number_of_connections,
            },
        };

        Ok(Repository {
            open_repository_schema: 1,
            name: self.auto_config.repository_name.clone(),
            build_date: self.server_info.build_date.date,
            files,
            modsets,
            game_servers,
            download_server,
        })
    }
}
