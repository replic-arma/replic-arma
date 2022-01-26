use std::{collections::HashMap, path::Path};

use jaded::{ConversionError, ConversionResult, FromJava, Value};

#[derive(Debug)]
struct SyncTreeList {
    file_list: Vec<SyncTreeLeaf>,
    directory_list: Vec<SyncTreeDirectory>,
}

impl FromJava for SyncTreeList {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let mut file_list: Vec<SyncTreeLeaf> = Vec::new();
                let mut directory_list: Vec<SyncTreeDirectory> = Vec::new();

                let mut annotation = data.get_annotation(0).unwrap();

                let size = annotation.read_i32()?;

                for _ in 0..size {
                    let object = annotation.read_object()?;

                    match object {
                        Value::Object(data) => {
                            if data.class_name() == "fr.soe.a3s.domain.repository.SyncTreeDirectory"
                            {
                                let val: SyncTreeDirectory = SyncTreeDirectory::from_value(object)?;
                                directory_list.push(val);
                            } else {
                                let val: SyncTreeLeaf = SyncTreeLeaf::from_value(object)?;
                                file_list.push(val);
                            }
                        }
                        Value::Null => return Err(ConversionError::NullPointerException),
                        _ => return Err(ConversionError::InvalidType("not an object")),
                    };
                }

                return Ok(SyncTreeList {
                    directory_list,
                    file_list,
                });
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}

#[derive(Debug, Clone)]
pub struct SyncTreeLeaf {
    pub name: String,
    pub sha1: String,
    pub size: i64,
    pub compressed_size: i64,
    pub updated: bool,
    pub deleted: bool,
    pub compressed: bool,
}

impl FromJava for SyncTreeLeaf {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let name = data.get_field_as("name")?;
                let sha1 = data.get_field_as("sha1")?;
                let size = data.get_field_as("size")?;
                let compressed_size = data.get_field_as("compressedSize")?;
                let updated = data.get_field_as("updated")?;
                let deleted = data.get_field_as("deleted")?;
                let compressed = data.get_field_as("compressed")?;
                Ok(SyncTreeLeaf {
                    name,
                    sha1,
                    size,
                    compressed_size,
                    updated,
                    deleted,
                    compressed,
                })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

#[derive(Debug)]
pub struct SyncTreeDirectory {
    pub name: String,
    pub mark_as_addon: bool,
    pub updated: bool,
    pub deleted: bool,
    pub hidden: bool,
    pub file_list: Vec<SyncTreeLeaf>,
    pub directory_list: Vec<SyncTreeDirectory>,
}

impl FromJava for SyncTreeDirectory {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let name = data.get_field_as("name")?;
                let mark_as_addon = data.get_field_as("markAsAddon")?;
                let deleted = data.get_field_as("deleted")?;
                let updated = data.get_field_as("updated")?;
                let hidden = data.get_field_as("hidden")?;

                let list: SyncTreeList = data.get_field_as("list")?;
                let directory_list = list.directory_list;
                let file_list = list.file_list;

                Ok(SyncTreeDirectory {
                    name,
                    mark_as_addon,
                    deleted,
                    updated,
                    hidden,
                    directory_list,
                    file_list,
                })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

impl SyncTreeDirectory {
    pub fn flat(&self, base: String) -> HashMap<String, SyncTreeLeaf> {
        let mut map = HashMap::<String, SyncTreeLeaf>::new();

        self.flat_rec(base, &mut map);

        map
    }

    fn flat_rec(&self, base: String, map: &mut HashMap<String, SyncTreeLeaf>) {
        let path = Path::new(&base);

        for leaf in self.file_list.iter() {
            let file_path = path.join(leaf.name.clone());

            if let Some(s) = file_path.to_str() {
                map.insert(String::from(s), leaf.clone());
            };
        }

        for dir in self.directory_list.iter() {
            let dir_path = path.join(dir.name.clone());

            if let Some(s) = dir_path.to_str() {
                dir.flat_rec(String::from(s), map);
            };
        }
    }
}
