use std::collections::HashMap;
use std::hash::Hash;

use jaded::{ConversionError, ConversionResult, FromJava, Value};

#[derive(Debug, Clone)]
pub struct JavaHashMap<K, V>
where
    K: FromJava + Eq + Hash,
    V: FromJava,
{
    pub hash_map: HashMap<K, V>,
    buckets: i32,
}

impl<K, V> FromJava for JavaHashMap<K, V>
where
    K: FromJava + Eq + Hash,
    V: FromJava,
{
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                if let Some(mut annotation) = data.get_annotation(0) {
                    let buckets = annotation.read_i32()?;
                    let size = annotation.read_i32()?;

                    let mut hash_map = HashMap::<K, V>::new();
                    for _ in 0..size {
                        let key: K = annotation.read_object_as()?;
                        let value: V = annotation.read_object_as()?;

                        hash_map.insert(key, value);
                    }
                    Ok(JavaHashMap { hash_map, buckets })
                } else {
                    Err(ConversionError::NullPointerException)
                }
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}
