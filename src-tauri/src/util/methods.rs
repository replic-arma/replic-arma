use std::{
    fs::{self, File, OpenOptions},
    path::Path,
};

use anyhow::Result;
use serde::{de::DeserializeOwned, Serialize};

pub fn load_t<T>(path: &Path) -> Result<T>
where
    T: Serialize + DeserializeOwned + Default,
{
    if path.exists() {
        let file = OpenOptions::new().read(true).open(path)?;

        Ok(serde_json::from_reader::<File, T>(file)?)
    } else {
        save_t(path, T::default())?;
        Ok(T::default())
    }
}

pub fn save_t<T>(path: &Path, data: T) -> Result<()>
where
    T: Serialize,
{
    if let Some(path_par) = path.parent() {
        if !path_par.exists() {
            fs::create_dir_all(path_par)?;
        }
    }

    let file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path)?;

    serde_json::to_writer(file, &data)?;

    Ok(())
}
