use std::{
    collections::HashMap,
    fs::{self, File, OpenOptions},
    io,
    path::PathBuf,
    str::FromStr,
    time::SystemTime,
};

use crate::util::types::Result;
use rayon::iter::{ParallelBridge, ParallelIterator};
use serde::{Deserialize, Serialize};
use sha1::{Digest, Sha1};
use uuid::Uuid;
use walkdir::WalkDir;

use crate::util::types::ResultThread;

pub struct DirectoryManager {
    pub dirs: HashMap<Uuid, ModDirectory>,
    data_dir: PathBuf,
}

impl DirectoryManager {
    const DIR_NAME: &'static str = "dirs";
    const FILE_NAME: &'static str = "dirs.json";

    pub fn new(data_dir: PathBuf) -> Self {
        DirectoryManager {
            dirs: HashMap::new(),
            data_dir,
        }
    }

    //     let x2 = WalkDir::new(self.data_dir.join(Self::DIR_NAME))
    //     .max_depth(0)
    //     .into_iter()
    //     .filter(|x| {
    //         if x.is_ok() {
    //             let path = x.unwrap().path();

    //             if path.is_file() {
    //                 if let Some(ext) = path.extension() {
    //                     return ext == "json";
    //                 }
    //             }
    //         }
    //         return false;
    //     })
    //     .map(|x| {
    //         let mut repo_file = OpenOptions::new().read(true).open(x.unwrap().path())?;

    //     });

    // let mut repo_file = OpenOptions::new()
    //     .read(true)
    //     .open(self.data_dir.join(Self::FILE_NAME))?;

    // self.dirs = serde_json::from_reader(repo_file)?;

    pub fn load(&mut self) -> Result<()> {
        let dir_files: (Vec<_>, Vec<_>) = WalkDir::new(self.data_dir.join(Self::DIR_NAME))
            .max_depth(0)
            .into_iter()
            .filter_map(|f| f.ok())
            .filter(|f| f.path().ends_with("json"))
            .map(|f| {
                let repo_file = OpenOptions::new()
                    .read(true)
                    .open(self.data_dir.join(Self::DIR_NAME).join(f.file_name()))?;

                Ok((
                    Uuid::from_str(f.file_name().to_str().unwrap_or_default())?,
                    serde_json::from_reader::<File, ModDirectory>(repo_file)?,
                ))
            })
            .partition(|x: &Result<(Uuid, ModDirectory)>| x.is_ok());
        //.filter(|f| f.);

        self.dirs = dir_files
            .0
            .into_iter()
            .map(|x| x.unwrap())
            .collect::<Vec<_>>()
            .into_iter()
            .collect();
        let e: Vec<_> = dir_files.1.into_iter().map(|x| x.unwrap_err()).collect();

        //self.dirs = u;

        Ok(())
    }

    //    let base_dir = self.data_dir.join(Self::DIR_NAME);
    //    fs::create_dir_all(base_dir)?;

    //    for dir in self.dirs {
    //        let dir_file = OpenOptions::new()
    //            .write(true)
    //            .create(true)
    //            .truncate(true)
    //            .open(base_dir.join(dir.0.to_string()).join(".json"))?;

    //        serde_json::to_writer(dir_file, &dir.1)?;
    //    }

    pub fn save(&self) -> Result<()> {
        fs::create_dir_all(self.data_dir.clone())?;

        let dir_file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(self.data_dir.join(Self::FILE_NAME))?;

        serde_json::to_writer(dir_file, &self.dirs)?;

        Ok(())
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ModDirectory {
    pub dir: String,
    pub files: HashMap<String, (String, SystemTime)>, //pub files: BiMap<String, >
}

impl ModDirectory {
    pub fn new(dir: String) -> Self {
        ModDirectory {
            dir,
            files: HashMap::new(),
        }
    }

    pub fn check(&mut self) -> Result<()> {
        //let hashes: Vec<(String, String)> =
        // HashMap<String, (String, SystemTime)>
        let s: (Vec<_>, Vec<_>) = WalkDir::new(self.dir.clone())
            .follow_links(true)
            .into_iter()
            //.filter_entry(|e| e.path().is_file())
            .par_bridge()
            .filter(|e| e.is_ok() && e.as_ref().unwrap().path().is_file())
            .map(|entry| self.check_update(entry?))
            .partition(|x| x.is_ok());
        //.partition(Result::is_ok);

        let u: HashMap<String, (String, SystemTime)> =
            s.0.into_iter()
                .map(|x| x.unwrap())
                .collect::<Vec<_>>()
                .into_iter()
                .collect();
        let e: Vec<_> = s.1.into_iter().map(|x| x.unwrap_err()).collect();

        self.files = u;

        Ok(())
    }

    fn check_update(
        &self,
        entry: walkdir::DirEntry,
    ) -> ResultThread<(String, (String, SystemTime))> {
        let path_str = entry.path().to_str().unwrap_or_default().to_owned();
        let cur_meta = entry.metadata()?.modified()?;

        if let Some(val) = self.files.get(&path_str) {
            if val.1 < cur_meta {
                Ok((path_str, (Self::compute_hash(entry)?, cur_meta)))
            } else {
                Ok((path_str, (val.0.clone(), cur_meta)))
            }
        } else {
            Ok((path_str, (Self::compute_hash(entry)?, cur_meta)))
        }

        //Err(Box::new(ReplicArmaError("".into())))
    }

    fn compute_hash(entry: walkdir::DirEntry) -> ResultThread<String> {
        let mut file = File::open(entry.path())?;
        let mut hasher = Sha1::new();
        io::copy(&mut file, &mut hasher)?;

        Ok(hex::encode(hasher.finalize()))
    }
}
