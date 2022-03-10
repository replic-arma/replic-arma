use std::{
    fs::{self, File},
    io::Write,
    path::Path,
    time::{Duration, SystemTime},
};

use anyhow::Result;
use async_trait::async_trait;
use chrono::DateTime;
use chrono::{serde::ts_seconds_option, Utc};
use hyper::{
    body::HttpBody,
    client::{connect::Connect, HttpConnector},
    header::{HeaderName, HeaderValue, ACCEPT_RANGES, CONTENT_LENGTH},
    Body, Client, HeaderMap, Uri,
};
use hyper::{
    header::{ETAG, LAST_MODIFIED, RANGE},
    Request,
};
use hyper_tls::HttpsConnector;
use serde::{Deserialize, Serialize};
use tauri::Window;
use url::Url;

pub(crate) fn get_header_value(
    headers: &HeaderMap<HeaderValue>,
    header_name: HeaderName,
) -> Option<&str> {
    if headers.contains_key(&header_name) {
        let header_value = &headers[header_name];

        if let Ok(header_str) = header_value.to_str() {
            return Some(header_str);
        }
    }
    None
}

pub(crate) fn get_part_info_from_headers(headers: &HeaderMap<HeaderValue>) -> PartInfo {
    let content_length: usize = get_header_value(headers, CONTENT_LENGTH)
        .unwrap_or_default()
        .parse()
        .unwrap_or_default();

    let last_modified =
        DateTime::parse_from_rfc2822(get_header_value(headers, LAST_MODIFIED).unwrap_or_default())
            .map(|t| t.with_timezone(&Utc))
            .ok();

    let e_tag = get_header_value(headers, ETAG)
        .unwrap_or_default()
        .to_owned();

    PartInfo {
        content_length,
        written_bytes: 0,
        file_modified: last_modified,
        e_tag,
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct PartInfo {
    content_length: usize,
    written_bytes: usize,
    #[serde(with = "ts_seconds_option")]
    file_modified: Option<DateTime<Utc>>,
    e_tag: String,
}

#[async_trait]
pub trait Downloader {
    async fn download_file(&self, window: &Window, url: Url, destination: &Path) -> Result<()>;
    async fn pause(&mut self);
    async fn get_pause(&self) -> bool;
}

async fn download_file<C>(
    window: &Window,
    downloader: &(dyn Downloader + Send + Sync),
    client: Client<C>,
    url: Url,
    destination: &Path,
) -> Result<()>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let uri: Uri = url.as_str().parse::<_>()?;

    //let mut res;
    let mut out = File::create(destination)?;
    let mut _write_size: usize = 0;

    let mut res = get_response(destination, uri, client).await?;

    let mut part_info = get_part_info_from_headers(res.headers());

    // let content_length: usize = get_header_value(res.headers(), CONTENT_LENGTH)
    //     .unwrap_or_default()
    //     .parse()
    //     .unwrap_or_default();

    // let last_modified = DateTime::parse_from_rfc2822(
    //     get_header_value(res.headers(), LAST_MODIFIED).unwrap_or_default(),
    // )
    // .map(|t| t.with_timezone(&Utc))
    // .ok();

    // let e_tag = get_header_value(res.headers(), ETAG)
    //     .unwrap_or_default()
    //     .to_owned();

    let accept_ranges =
        get_header_value(res.headers(), ACCEPT_RANGES).unwrap_or_default() != "none";

    // let length = res.headers().try_entry(CONTENT_LENGTH).unwrap();
    // let mut hash = Sha1::new();
    let mut now = SystemTime::now();
    let one_sec = Duration::from_millis(250);

    let mut bytes_written_sec: usize = 0;
    let mut bytes_written_complete: usize = 0;

    //let mut paused = false;

    while let Some(next) = res.data().await {
        let chunk = next?;

        _write_size += out.write(&chunk)?;
        bytes_written_sec += chunk.len();
        bytes_written_complete += chunk.len();

        if now.elapsed().unwrap_or_default() >= one_sec {
            let dl_speed = bytes_written_sec * 4 / 1024;
            window.emit("download_report", dl_speed).unwrap();

            now = SystemTime::now();
            bytes_written_sec = 0;
        }

        if downloader.get_pause().await && accept_ranges {
            part_info.written_bytes = bytes_written_complete;

            fs::write(
                destination.join(".part"),
                serde_json::to_string(&part_info)?,
            )?;

            break;
        }

        // hash.update(&chunk);
    }

    // let sha1 = hash.finalize();
    Ok(())
}

async fn get_response<C>(
    destination: &Path,
    uri: Uri,
    client: Client<C>,
) -> Result<hyper::Response<Body>>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let part_file = &destination.join(".part");
    if Path::new(part_file).is_file() {
        let part_info_old: PartInfo = serde_json::from_reader(File::open(part_file)?)?;
        fs::remove_file(part_file)?;

        let req = Request::get(uri.clone())
            .header(RANGE, part_info_old.written_bytes + 1)
            .body(Body::empty())?;
        let res = client.request(req).await?;

        if let Some(accept_ranges) = get_header_value(res.headers(), ACCEPT_RANGES) {
            if accept_ranges != "none" {
                let part_info = get_part_info_from_headers(res.headers());

                if part_info.file_modified == part_info_old.file_modified
                    && part_info.e_tag == part_info_old.e_tag
                {
                    return Ok(res);
                }
            }
        }

        Ok(res)
    } else {
        Ok(client.get(uri).await?)
    }
}

pub struct HttpDownloader {
    client: Client<HttpConnector>,
    paused: bool,
}

impl HttpDownloader {
    pub fn new() -> Self {
        HttpDownloader {
            client: Client::new(),
            paused: false,
        }
    }
}

#[async_trait]
impl Downloader for HttpDownloader {
    async fn download_file(&self, window: &Window, url: Url, destination: &Path) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(window, self, self.client.clone(), url, destination).await?)
    }

    async fn pause(&mut self) {
        self.paused = true;
    }

    async fn get_pause(&self) -> bool {
        self.paused
    }
}

pub struct HttpsDownloader {
    client: Client<HttpsConnector<HttpConnector>>,
    paused: bool,
}

impl HttpsDownloader {
    pub fn new() -> Self {
        let https = HttpsConnector::new();
        let client = Client::builder().build::<_, hyper::Body>(https);
        HttpsDownloader {
            client,
            paused: false,
        }
    }
}

#[async_trait]
impl Downloader for HttpsDownloader {
    async fn download_file(&self, window: &Window, url: Url, destination: &Path) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(window, self, self.client.clone(), url, destination).await?)
    }

    async fn pause(&mut self) {
        self.paused = true;
    }

    async fn get_pause(&self) -> bool {
        self.paused
    }
}
