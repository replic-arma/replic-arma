use std::error;

pub type Result<T> = std::result::Result<T, Box<dyn error::Error>>;

enum RepoType {
    A3S = 1,
    Swifty = 2,
}
