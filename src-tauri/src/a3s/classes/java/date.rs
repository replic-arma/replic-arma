use jaded::{FromValue, ConversionResult, ConversionError, Value};
use byteorder::{ByteOrder, BigEndian};  
use chrono::{DateTime, Utc, NaiveDateTime};

#[derive(Debug)]
pub struct JavaDate {
    val: DateTime<Utc>
}

impl JavaDate {
    pub fn value(&self) -> DateTime<Utc> {
        self.val
    }
}

impl FromValue for JavaDate {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let annotation = data.get_annotation(0).unwrap();
                let millis = BigEndian::read_i64(annotation[0].data());
                
                let val = DateTime::<Utc>::from_utc(NaiveDateTime::from_timestamp(millis / 1000, 0), Utc);

                return Ok(JavaDate{val});
            },
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}
