use std::collections::HashSet;
use std::hash::Hash;

use jaded::{ConversionError, ConversionResult, FromJava, Value};

#[derive(Debug, Clone)]
pub struct JavaHashSet<T> {
    pub set: HashSet<T>,
    pub capacity: i32,
    pub load_factor: f32,
    pub size: i32,
}

impl<T: FromJava + Eq + Hash> FromJava for JavaHashSet<T> {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                if let Some(mut annotation) = data.get_annotation(0) {
                    let capacity = annotation.read_i32()?;
                    let load_factor = annotation.read_f32()?;
                    let size = annotation.read_i32()?;

                    let mut set = HashSet::<T>::new();

                    for _ in 0..size {
                        let item: T = annotation.read_object_as()?;
                        set.insert(item);
                    }

                    Ok(JavaHashSet {
                        set,
                        capacity,
                        load_factor,
                        size,
                    })
                } else {
                    Err(ConversionError::NullPointerException)
                }
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}
