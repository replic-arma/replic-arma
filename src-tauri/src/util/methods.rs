use std::{
    fs::{File, OpenOptions},
    path::PathBuf,
};

use anyhow::Result;

use serde::{de::DeserializeOwned, Serialize};

pub fn load_t<T>(path: PathBuf) -> Result<T>
where
    T: DeserializeOwned + Default,
{
    if path.exists() {
        let file = OpenOptions::new().read(true).open(path)?;

        Ok(serde_json::from_reader::<File, T>(file)?)
    } else {
        Ok(T::default())
    }
}

pub fn save_t<T>(path: PathBuf, data: T) -> Result<()>
where
    T: Serialize,
{
    let file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path)?;

    serde_json::to_writer(file, &data)?;

    Ok(())
}
