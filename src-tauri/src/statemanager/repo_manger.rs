use serde::Deserialize;
use serde::Serialize;
use uuid::Uuid;

use crate::repository::Repo;
use crate::repository::Repository;
use crate::util::types::ReplicArmaError;
use crate::util::types::RepoType;
use crate::util::types::Result;
use crate::A3SRepository;
use crate::SwiftyRepository;
use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::path::PathBuf;

pub struct RepoManager {
    pub repos: HashMap<Uuid, Repository>,

    pub data_dir: PathBuf,
}

#[derive(Serialize, Deserialize, Debug)]
struct RepoJSON {
    pub id: Uuid,
    pub repo_type: RepoType,
    pub url: String,
}

impl From<(&Uuid, &Box<dyn Repo + Send + Sync>)> for RepoJSON {
    fn from(val: (&Uuid, &Box<dyn Repo + Send + Sync>)) -> Self {
        RepoJSON {
            id: *val.0,
            repo_type: val.1.get_type(),
            url: val.1.get_url(),
        }
    }
}

impl RepoManager {
    const FILE_NAME: &'static str = "repos.json";

    pub fn add(&mut self, url: String) -> Result<Uuid> {
        let repo = Self::repo_from_url(url)?;
        let id = repo.id;
        self.repos.insert(repo.id, repo);
        Ok(id)
    }

    pub fn load(&mut self) -> Result<()> {
        let mut repo_file = OpenOptions::new()
            .read(true)
            .open(self.data_dir.join(Self::FILE_NAME))?;

        let repos: Vec<Repository> = serde_json::from_reader(repo_file)?;
        for repo in repos {
            self.repos.insert(repo.id, repo);
        }

        Ok(())
    }

    pub fn new(data_dir: PathBuf) -> Self {
        RepoManager {
            repos: HashMap::new(),
            data_dir,
        }
    }

    fn repo_from_url(url: String) -> Result<Repository> {
        let repo: Repository;
        if url.ends_with("autoconfig") {
            repo = A3SRepository::from_auto_config(url)?.to_repository();
        } else if url.ends_with(".json") {
            repo = SwiftyRepository::from_repo_json(url)?.to_repository();
        } else {
            return Err(Box::new(ReplicArmaError { msg: "repo".into() }));
        }
        Ok(repo)
    }

    pub fn save(&self) -> Result<()> {
        let repos: Vec<Repository> = self.repos.values().cloned().collect();

        fs::create_dir_all(self.data_dir.clone())?;

        let repo_file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(self.data_dir.join(Self::FILE_NAME))?;

        serde_json::to_writer(repo_file, &repos)?;
        Ok(())
    }
}
