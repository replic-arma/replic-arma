use jaded::{FromValue, ConversionResult, ConversionError, Value};
use byteorder::{ByteOrder, BigEndian};

#[derive(Debug)]
pub struct JavaArrayList<T> {
    val: Vec<T>
}

impl<T: std::clone::Clone> JavaArrayList<T> {
    pub fn value(&self) -> Vec<T> {
        self.val.clone()
    }
}

impl<T: FromValue> FromValue for JavaArrayList<T> {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let annotation = data.get_annotation(0).unwrap();

                let size = BigEndian::read_i32(annotation[0].data());
                
                let mut val: Vec<T> = Vec::new();
                for i in 1..(size+1) as usize {
                    let item: T = T::from_value(annotation[i].value())?;
                    val.push(item);
                }

                return Ok(JavaArrayList{val});
            },
            Value::Null => Ok(JavaArrayList{val: Vec::new()}),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}
