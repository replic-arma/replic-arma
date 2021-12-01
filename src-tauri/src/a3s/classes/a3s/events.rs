use jaded::{FromValue, ConversionResult, ConversionError, Value};
use super::super::java::{JavaHashMap, JavaArrayList};
use crate::a3s::utils::{from_java_obj, FromJavaObject};

/* ----------------------------------------------------------------------- Event ---------------------------------------------------------------------- */
use std::collections::HashMap;
#[derive(Debug, Clone)]
pub struct Event {
    pub name: String,
    pub description: String,
    pub addon_names: HashMap<String, bool>,
    pub userconfig_folder_names: HashMap<String, bool>
}

impl FromValue for Event {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let name = data.get_field_as("name")?;
                let description = data.get_field_as("description")?;

                let addon_names = data.get_field_as::<JavaHashMap<String, bool>>("addonNames")?.value();

                let userconfig_folder_names = data.get_field_as::<JavaHashMap<String, bool>>("userconfigFolderNames")?.value();

                return Ok(Event{name,description,addon_names,userconfig_folder_names});
            },
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}

/* ---------------------------------------------------------------------- Events ---------------------------------------------------------------------- */
#[derive(Debug)]
pub struct Events {
    pub list: Vec<Event>,
}

impl FromValue for Events {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let list = data.get_field_as::<JavaArrayList<Event>>("list")?.value();
                return Ok(Events{list});
            },
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}

impl FromJavaObject for Events {
    fn from_java_obj(slice: &[u8]) -> Result<Box<Events>, Box<dyn std::error::Error>> {
        return from_java_obj(slice);
    }
}
