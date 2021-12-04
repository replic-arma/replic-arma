use byteorder::{BigEndian, ByteOrder};
use jaded::{ConversionError, ConversionResult, FromValue, Value};
use std::collections::HashSet;
use std::hash::Hash;

#[derive(Debug)]
pub struct JavaHashSet<T> {
    val: HashSet<T>,
    capacity: i32,
    load_factor: f32,
    size: i32,
}

impl<T: std::clone::Clone> JavaHashSet<T> {
    pub fn value(&self) -> HashSet<T> {
        self.val.clone()
    }
}

impl<T: FromValue + Eq + Hash> FromValue for JavaHashSet<T> {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let annotation = data.get_annotation(0).unwrap();
                let block = annotation[0].data();

                let capacity = BigEndian::read_i32(&block[0..4]);
                let load_factor = BigEndian::read_f32(&block[4..8]);
                let size = BigEndian::read_i32(&block[8..]);

                let mut val = HashSet::<T>::new();
                for i in 1..(size + 1) as usize {
                    let item: T = T::from_value(annotation[i].value())?;
                    val.insert(item);
                }

                return Ok(JavaHashSet {
                    val,
                    capacity,
                    load_factor,
                    size,
                });
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}
