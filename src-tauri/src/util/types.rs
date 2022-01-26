use core::fmt;

use serde::{Deserialize, Serialize};

// pub type Result<T> = std::result::Result<T, Box<dyn error::Error>>;
// pub type ResultThread<T> = std::result::Result<T, Box<dyn error::Error + Send + Sync>>;
pub type JSResult<T> = std::result::Result<T, ErrorJson>;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum RepoType {
    A3S = 1,
    Swifty = 2,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ErrorJson {
    pub description: String,
    pub source: String,
}

impl From<Box<dyn std::error::Error>> for ErrorJson {
    fn from(err: Box<dyn std::error::Error>) -> Self {
        ErrorJson {
            description: err.to_string(),
            source: err.source().map(|src| src.to_string()).unwrap_or_default(),
        }
    }
}

impl From<anyhow::Error> for ErrorJson {
    fn from(err: anyhow::Error) -> Self {
        ErrorJson {
            description: err.to_string(),
            source: err.source().unwrap().to_string(),
        }
    }
}

#[derive(Debug)]
pub struct ReplicArmaError {
    pub msg: String,
}

impl fmt::Display for ReplicArmaError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "There is an error: {}", self.msg)
    }
}
