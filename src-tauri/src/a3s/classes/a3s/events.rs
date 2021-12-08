use super::super::java::{JavaArrayList, JavaHashMap};
use crate::a3s::utils::{from_java_obj, FromJavaObject};
use jaded::{ConversionError, ConversionResult, FromValue, Value};

/* ----------------------------------------------------------------------- Event ---------------------------------------------------------------------- */
use std::collections::HashMap;
#[derive(Debug, Clone)]
pub struct Event {
    pub name: String,
    pub description: String,
    pub addon_names: HashMap<String, bool>,
    pub userconfig_folder_names: HashMap<String, bool>,
}

impl FromValue for Event {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let name = data.get_field_as("name")?;
                let description = data.get_field_as("description")?;

                let addon_names = data
                    .get_field_as::<JavaHashMap<String, bool>>("addonNames")?
                    .value();

                let userconfig_folder_names = data
                    .get_field_as::<JavaHashMap<String, bool>>("userconfigFolderNames")?
                    .value();

                Ok(Event {
                    name,
                    description,
                    addon_names,
                    userconfig_folder_names,
                })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

/* ---------------------------------------------------------------------- Events ---------------------------------------------------------------------- */
#[derive(Debug)]
pub struct Events {
    pub list: Vec<Event>,
}

impl FromValue for Events {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let list = data.get_field_as::<JavaArrayList<Event>>("list")?.value();
                Ok(Events { list })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

impl FromJavaObject for Events {
    fn from_java_obj(slice: &[u8]) -> Result<Box<Events>, Box<dyn std::error::Error>> {
        from_java_obj(slice)
    }
}
