use serde::Deserialize;
use serde::Serialize;
use uuid::Uuid;

use crate::repository::Repo;
use crate::util::types::ReplicArmaError;
use crate::util::types::RepoType;
use crate::util::types::Result;
use crate::A3SRepository;
use crate::SwiftyRepository;
use std::collections::HashMap;
use std::fs::{self, OpenOptions};
use std::path::PathBuf;

pub struct RepoManager {
    pub repos: HashMap<Uuid, Box<dyn Repo + Send + Sync>>,

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

//impl

impl RepoManager {
    const FILE_NAME: &'static str = "repos.json";

    pub fn add(&mut self, url: String) -> Result<Uuid> {
        // if url.ends_with("autoconfig") {
        //     repo = Box::new(A3SRepository::from_auto_config(url)?);
        // } else if url.ends_with(".json") {
        //     //Err(Error"nope")
        //     repo = Box::new(SwiftyRepository::from_repo_json(url)?);
        // } else {
        //     return Err(Box::new(ReplicArmaError("repo".into())));
        // }

        let id = Uuid::new_v4();
        self.repos.insert(id, Self::repo_from_url(url)?);

        Ok(id)
    }

    pub fn load(&mut self) -> Result<()> {
        let mut repo_file = OpenOptions::new()
            .read(true)
            .open(self.data_dir.join(Self::FILE_NAME))?;

        let v: Vec<RepoJSON> = serde_json::from_reader(repo_file)?;

        for repo in v {
            self.repos.insert(repo.id, Self::repo_from_url(repo.url)?);
        }

        Ok(())
    }

    pub fn new(data_dir: PathBuf) -> Self {
        RepoManager {
            repos: HashMap::new(),
            data_dir,
        }
    }

    fn repo_from_url(url: String) -> Result<Box<dyn Repo + Send + Sync>> {
        let repo: Box<dyn Repo + Send + Sync>;
        if url.ends_with("autoconfig") {
            repo = Box::new(A3SRepository::from_auto_config(url)?);
        } else if url.ends_with(".json") {
            repo = Box::new(SwiftyRepository::from_repo_json(url)?);
        } else {
            return Err(Box::new(ReplicArmaError { msg: "repo".into() }));
        }
        Ok(repo)
    }

    pub fn save(&self) -> Result<()> {
        let v: Vec<RepoJSON> = self.repos.iter().map(RepoJSON::from).collect();

        //let s = serde_json::to_string(&v).unwrap();

        fs::create_dir_all(self.data_dir.clone())?;

        let repo_file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(self.data_dir.join(Self::FILE_NAME))?;

        serde_json::to_writer(repo_file, &v)?;
        //println!("{}", s);

        Ok(())
    }
}
