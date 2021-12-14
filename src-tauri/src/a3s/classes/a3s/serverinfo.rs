use jaded::FromJava;

use crate::a3s::classes::java::{date::JavaDate, hashset::JavaHashSet};

#[derive(Debug, Clone, FromJava)]
pub struct ServerInfo {
    pub revision: i32,
    #[jaded(field = "buildDate")]
    pub build_date: JavaDate,
    #[jaded(field = "numberOfFiles")]
    pub number_of_files: i64,
    #[jaded(field = "totalFilesSize")]
    pub total_files_size: i64,
    #[jaded(field = "hiddenFolderPaths")]
    pub hidden_folder_paths: JavaHashSet<String>,
    #[jaded(field = "numberOfConnections")]
    pub number_of_connections: i32,
    #[jaded(field = "noPartialFileTransfer")]
    pub no_partial_file_transfer: bool,
    #[jaded(field = "repositoryContentUpdated")]
    pub repository_content_updated: bool,
    #[jaded(field = "compressedPboFilesOnly")]
    pub compressed_pbo_files_only: bool,
}
