use anyhow::Result;
use core::time::Duration;
use curl::easy::Easy;
use flate2::read::GzDecoder;
use jaded::{FromJava, Parser};
use std::io::prelude::*;
use std::io::Cursor;
use url::Url;

// pub trait FromJavaObject {
//     fn from_java_obj(slice: &[u8]) -> Result<Box<Self>>;
// }

// pub fn from_java_obj<T: FromJava>(slice: &[u8]) -> Result<Box<T>> {
//     let mut parser = Parser::new(slice).expect("Bytes stream was not valid");
//     let val: T = parser.read_as()?;
//     Ok(Box::new(val))
// }

pub fn fetch(url: String) -> Result<Vec<u8>> {
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

    let _code = easy.response_code()?;
    // if code >= 400 {

    //     return Err(Box::<dyn std::error::Error>::from(format!(
    //         "Received non okay status code {:?}",
    //         code
    //     )));
    // }

    Ok(response_body)
}

pub fn unzip(zipped_data: Vec<u8>) -> Result<Vec<u8>> {
    let file = Cursor::new(zipped_data);

    let mut file_unzipped = GzDecoder::new(file);
    let mut data = Vec::new();
    file_unzipped.read_to_end(&mut data)?;

    Ok(data)
}

pub fn fetch_java_object<T: FromJava>(mut base_url: Url, file_name: Option<&str>) -> Result<T> {
    if let Some(file) = file_name {
        base_url = base_url.join(file)?;
    }
    let mut parser = Parser::new(Cursor::new(unzip(fetch(base_url.to_string())?)?))?;
    Ok(parser.read_as()?)
}

// pub fn fetch_meta_file<T: FromJavaObject>(base_url: String, file_name: &str) -> Result<T> {
//     let mut url = Url::parse(&base_url)?;
//     {
//         let mut seg = url.path_segments_mut().unwrap();
//         seg.push(super::A3S_FOLDER_NAME);
//         seg.push(file_name);
//     }

//     let bytes = unzip(fetch(url.into_string())?)?;
//     let value = T::from_java_obj(bytes.as_slice())?;

//     Ok(*value)
// }
