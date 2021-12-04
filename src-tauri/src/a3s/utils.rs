use core::time::Duration;
use curl::easy::Easy;
use flate2::read::GzDecoder;
use jaded::{FromValue, Parser};
use std::io::prelude::*;
use std::io::Cursor;
use url::Url;

pub trait FromJavaObject {
    fn from_java_obj(slice: &[u8]) -> Result<Box<Self>, Box<dyn std::error::Error>>;
}

pub fn from_java_obj<T: FromValue>(slice: &[u8]) -> Result<Box<T>, Box<dyn std::error::Error>> {
    let mut parser = Parser::new(slice).expect("Bytes stream was not valid");
    let val: T = parser.read_as()?;
    return Ok(Box::new(val));
}

pub fn fetch(url: String) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let mut response_body = Vec::new();
    let mut easy = Easy::new();
    easy.timeout(Duration::from_secs(3))?;
    easy.follow_location(true)?;
    easy.url(&url)?;
    {
        let mut transfer = easy.transfer();
        transfer.write_function(|data| {
            response_body.extend_from_slice(data);
            Ok(data.len())
        })?;
        transfer.perform()?;
    }

    let code = easy.response_code()?;
    if code >= 400 {
        return Err(Box::<dyn std::error::Error>::from(format!(
            "Received non okay status code {:?}",
            code
        )));
    }

    return Ok(response_body);
}

pub fn unzip(zipped_data: Vec<u8>) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let file = Cursor::new(zipped_data);

    let mut file_unzipped = GzDecoder::new(file);
    let mut data = Vec::new();
    file_unzipped.read_to_end(&mut data)?;

    return Ok(data);
}

pub fn fetch_meta_file<T: FromJavaObject>(
    base_url: String,
    file_name: &str,
) -> Result<T, Box<dyn std::error::Error>> {
    let mut url = Url::parse(&base_url)?;
    {
        let mut seg = url.path_segments_mut().unwrap();
        seg.push(super::A3S_FOLDER_NAME);
        seg.push(file_name);
    }

    let bytes = unzip(fetch(url.into_string())?)?;
    let value = T::from_java_obj(&bytes.as_slice())?;

    return Ok(*value);
}
