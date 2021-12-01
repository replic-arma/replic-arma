use std::collections::HashSet;
use chrono::{DateTime, Utc};
use jaded::{FromValue, ConversionResult, ConversionError, Value};
use super::super::java::{JavaHashSet,JavaDate};
use crate::a3s::utils::{from_java_obj, FromJavaObject};

#[derive(Debug)]
pub struct ServerInfo {
    pub revision: i32,
    pub build_date: DateTime<Utc>,
    pub number_of_files: i64,
    pub total_file_size: i64,
    pub hidden_folder_paths: HashSet<String>,
    pub number_of_connections: i32,
    pub no_partial_file_transfer: bool,
    pub repository_content_updated: bool,
    pub compressed_pbo_files_only: bool
}

impl FromValue for ServerInfo {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let revision = data.get_field_as("revision")?;
                let build_date = data.get_field_as::<JavaDate>("buildDate")?.value();
                let number_of_files = data.get_field_as("numberOfFiles")?;
                let total_file_size = data.get_field_as("totalFilesSize")?;
                let number_of_connections = data.get_field_as("numberOfConnections")?;
                let no_partial_file_transfer = data.get_field_as("noPartialFileTransfer")?;
                let repository_content_updated = data.get_field_as("repositoryContentUpdated")?;
                let compressed_pbo_files_only = data.get_field_as("compressedPboFilesOnly")?;
                let hidden_folder_paths = data.get_field_as::<JavaHashSet<String>>("hiddenFolderPaths")?.value();
                return Ok(ServerInfo{revision, build_date, number_of_files, total_file_size, number_of_connections, no_partial_file_transfer, repository_content_updated, compressed_pbo_files_only, hidden_folder_paths});
            },
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}

impl FromJavaObject for ServerInfo {
    fn from_java_obj(slice: &[u8]) -> Result<Box<ServerInfo>, Box<dyn std::error::Error>> {
        return from_java_obj(slice);
    }
}