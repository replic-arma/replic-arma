use std::collections::HashMap;
use std::hash::Hash;
use jaded::{FromValue, ConversionResult, ConversionError, Value};
use byteorder::{ByteOrder, BigEndian};

#[derive(Debug)]
pub struct JavaHashMap<K, V>{
    val: HashMap<K, V>,
    buckets: i32,
}

impl<K: std::clone::Clone, V: std::clone::Clone> JavaHashMap<K, V> {
    pub fn value(&self) -> HashMap<K, V> {
        self.val.clone()
    }
}

impl<K: FromValue + Eq + Hash, V: FromValue> FromValue for JavaHashMap<K, V> {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let annotation = data.get_annotation(0).unwrap();
                let block = annotation[0].data();

                let buckets = BigEndian::read_i32(&block[0..4]);
                let size = BigEndian::read_i32(&block[4..]);

                let mut val = HashMap::<K, V>::new();
                for i in 0..size {
                    let index = 1 + (i as usize) * 2;
                    let key: K = K::from_value(annotation[index].value())?;
                    let value: V = V::from_value(annotation[index+1].value())?;
                    
                    val.insert(key, value);
                }

                return Ok(JavaHashMap{val, buckets});
            },
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}