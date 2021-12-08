use super::super::java::{JavaArrayList, JavaDate};
use crate::a3s::utils::{from_java_obj, FromJavaObject};
use chrono::{DateTime, Utc};
use jaded::{ConversionError, ConversionResult, FromValue, Value};

/* --------------------------------------------------------------------- Changelog -------------------------------------------------------------------- */
#[derive(Debug, Clone)]
pub struct Changelog {
    revision: i32,
    build_date: DateTime<Utc>,
    addons: Vec<String>,
    new_addons: Vec<String>,
    deleted_addons: Vec<String>,
    updated_addons: Vec<String>,
    content_updated: bool,
}
impl FromValue for Changelog {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let revision = data.get_field_as("revision")?;
                let content_updated = data.get_field_as("contentUpdated")?;

                let addons = data
                    .get_field_as::<JavaArrayList<String>>("addons")?
                    .value();
                let new_addons = data
                    .get_field_as::<JavaArrayList<String>>("newAddons")?
                    .value();
                let deleted_addons = data
                    .get_field_as::<JavaArrayList<String>>("deletedAddons")?
                    .value();
                let updated_addons = data
                    .get_field_as::<JavaArrayList<String>>("updatedAddons")?
                    .value();

                let build_date = data.get_field_as::<JavaDate>("buildDate")?.value();

                Ok(Changelog {
                    revision,
                    addons,
                    new_addons,
                    deleted_addons,
                    updated_addons,
                    content_updated,
                    build_date,
                })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

/* -------------------------------------------------------------------- Changelogs -------------------------------------------------------------------- */
#[derive(Debug)]
pub struct Changelogs {
    list: Vec<Changelog>,
}

impl FromValue for Changelogs {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let list = data
                    .get_field_as::<JavaArrayList<Changelog>>("list")?
                    .value();
                Ok(Changelogs { list })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

impl FromJavaObject for Changelogs {
    fn from_java_obj(slice: &[u8]) -> Result<Box<Changelogs>, Box<dyn std::error::Error>> {
        from_java_obj(slice)
    }
}
