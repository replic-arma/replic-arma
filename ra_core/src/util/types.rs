use serde::{Deserialize, Serialize};

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
        let mut source = String::new();
        if let Some(src) = err.source() {
            source = src.to_string();
        }
        ErrorJson {
            description: err.to_string(),
            source,
        }
    }
}
