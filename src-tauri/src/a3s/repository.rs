use super::utils::{fetch, fetch_meta_file, unzip, FromJavaObject};
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
    pub fn from_auto_config(url: String) -> Result<A3SRepository, Box<dyn std::error::Error>> {
        let auto_config = unzip(fetch(url)?)?;
        let auto_config = *AutoConfig::from_java_obj(&auto_config.as_slice())?;

        let url = auto_config.protocol.to_url()?;

        let changelogs: Changelogs = fetch_meta_file(url.clone(), super::CHANGELOGS_FILE_NAME)?;
        let sync: SyncTreeDirectory = fetch_meta_file(url.clone(), super::SYNC_FILE_NAME)?;
        let server_info: ServerInfo = fetch_meta_file(url.clone(), super::SERVERINFO_FILE_NAME)?;
        let events: Events = fetch_meta_file(url.clone(), super::EVENTS_FILE_NAME)?;

        return Ok(A3SRepository {
            auto_config,
            changelogs,
            sync,
            server_info,
            events,
        });
    }

    pub fn to_repository(&self) -> Result<Repository, Box<dyn std::error::Error>> {
        // modsets
        let mut modsets = Vec::<Modset>::new();
        for event in self.events.list.iter() {
            let mut mods = Vec::<ModsetMod>::new();

            for (addon, _) in event.addon_names.iter() {
                mods.push(ModsetMod {
                    mod_type: String::from("mod"),
                    name: addon.clone(),
                    allow_compat: None,
                });
            }

            modsets.push(Modset {
                name: event.name.clone(),
                description: event.description.clone(),
                mods: mods,
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
        for server in self.auto_config.favorite_servers.iter() {
            game_servers.push(GameServer {
                host: server.ip_address.clone(),
                port: server.port.to_string(),
                password: server.password.clone(),
                name: server.name.clone(),
                modset: if server.modset_name == "" {
                    None
                } else {
                    Some(server.modset_name.clone())
                },
            });
        }

        let download_server = DownloadServer {
            url: self.auto_config.protocol.to_url()?,
            options: DownloadServerOptions {
                max_connections: self.server_info.number_of_connections,
            },
        };

        return Ok(Repository {
            open_repository_schema: 1,
            name: self.auto_config.repository_name.clone(),
            build_date: self.server_info.build_date,
            files: files,
            modsets: modsets,
            game_servers: game_servers,
            download_server: download_server,
        });
    }
}
