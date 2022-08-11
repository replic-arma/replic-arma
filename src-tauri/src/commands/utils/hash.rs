use std::{fs::File, io, path::PathBuf};

use anyhow::Result;
use filetime::FileTime;
use sha1::{Digest, Sha1};

use super::types::{FileHash, KnownHash};

pub fn check_update(known_hash: KnownHash) -> Result<FileHash> {
    let path = PathBuf::from(&known_hash.path);

    let meta = path.metadata()?;
    let time_modified = FileTime::from_last_modification_time(&meta).unix_seconds();
    let size = meta.len();

    if size == 0 {
        Ok(FileHash {
            path: known_hash.path,
            hash: "0".into(),
            time_modified,
            size: 0,
        })
    } else if known_hash.time_modified < time_modified {
        Ok(FileHash {
            path: known_hash.path,
            hash: compute_hash(path)?,
            time_modified,
            size,
        })
        //(known_hash.0, compute_hash(path)?, time_modified, size))
    } else {
        Ok(FileHash {
            path: known_hash.path,
            hash: known_hash.hash,
            time_modified,
            size,
        })
        //Ok((known_hash.0, known_hash.1 .0, time_modified, size))
    }
}

pub fn compute_hash(path: PathBuf) -> Result<String> {
    let mut file = File::open(path)?;
    let mut hasher = Sha1::new();
    io::copy(&mut file, &mut hasher)?;

    Ok(hex::encode(hasher.finalize()))
}
