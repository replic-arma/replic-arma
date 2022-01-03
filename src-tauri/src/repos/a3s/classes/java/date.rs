use chrono::{DateTime, NaiveDateTime, Utc};
use jaded::{ConversionError, ConversionResult, FromJava, Value};

#[derive(Debug, Clone)]
pub struct JavaDate {
    pub date: DateTime<Utc>,
}

impl FromJava for JavaDate {
    fn from_value(value: &jaded::Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                if let Some(mut annotation) = data.get_annotation(0) {
                    let millis = annotation.read_i64()?;
                    let date = DateTime::<Utc>::from_utc(
                        NaiveDateTime::from_timestamp(millis / 1000, 0),
                        Utc,
                    );
                    Ok(JavaDate { date })
                } else {
                    Err(ConversionError::NullPointerException)
                }
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}
