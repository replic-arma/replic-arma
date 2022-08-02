use anyhow::anyhow;
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
use std::{
    ffi::{OsStr, OsString},
    fs::{self, File, OpenOptions},
    io::Write,
    path::{Path, PathBuf},
    sync::Arc,
};
use tauri::async_runtime::Mutex;
use url::Url;

use crate::state::ReplicArmaState;

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
    async fn download_file(
        &self,
        state: &tauri::State<'_, ReplicArmaState>,
        total_written_bytes: &Arc<Mutex<usize>>,
        url: Url,
        destination: &Path,
    ) -> Result<()>;

    async fn download_file_simple(&self, url: Url, destination: &Path) -> Result<()>;
}

fn append_ext(ext: impl AsRef<OsStr>, path: PathBuf) -> PathBuf {
    let mut os_string: OsString = path.into();
    os_string.push(".");
    os_string.push(ext.as_ref());
    os_string.into()
}

async fn download_file<C>(
    state: &tauri::State<'_, ReplicArmaState>,
    total_written_bytes: &Arc<Mutex<usize>>,
    client: Client<C>,
    url: Url,
    destination: &Path,
) -> Result<()>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let uri: Uri = url.as_str().parse::<_>()?;

    let mut _write_size: usize = 0;

    let res_tuple = get_response(destination, uri, client).await?;
    let mut res = res_tuple.0;

    let mut out = if res_tuple.1 {
        OpenOptions::new()
            .write(true)
            .append(true)
            .open(destination)?
    } else {
        File::create(destination)?
    };

    let mut part_info = get_part_info_from_headers(res.headers());

    let accept_ranges =
        get_header_value(res.headers(), ACCEPT_RANGES).unwrap_or_default() != "none";

    let mut bytes_written_complete: usize = 0;

    while let Some(next) = res.data().await {
        let chunk = next?;

        _write_size += out.write(&chunk)?;

        let chunk_len = chunk.len();

        *total_written_bytes.lock().await += chunk_len;

        bytes_written_complete += chunk_len;

        let keep_downloading = (*state.downloading.lock().await).unwrap_or(true);

        if !keep_downloading && accept_ranges {
            part_info.written_bytes = bytes_written_complete;

            println!(
                "Writing part file: {}",
                append_ext("part", destination.to_path_buf())
                    .to_str()
                    .unwrap_or_default()
            );
            fs::write(
                append_ext("part", destination.to_path_buf()),
                serde_json::to_string(&part_info)?,
            )?;

            println!("Writing part file done");

            break;
        }

        // hash.update(&chunk);
    }

    // let sha1 = hash.finalize();
    Ok(())
}

async fn download_file_simple<C>(client: Client<C>, url: Url, destination: &Path) -> Result<()>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let uri: Uri = url.as_str().parse::<_>()?;

    let mut _write_size: usize = 0;

    let res_tuple = get_response(destination, uri, client).await?;
    let mut res = res_tuple.0;

    let mut out = if res_tuple.1 {
        OpenOptions::new()
            .write(true)
            .append(true)
            .open(destination)?
    } else {
        File::create(destination)?
    };

    while let Some(next) = res.data().await {
        let chunk = next?;
        _write_size += out.write(&chunk)?;
    }

    Ok(())
}

async fn get_response<C>(
    destination: &Path,
    uri: Uri,
    client: Client<C>,
) -> Result<(hyper::Response<Body>, bool)>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let part_file = &append_ext("part", destination.to_path_buf()); // &destination.join(".part");
    if Path::new(part_file).is_file() {
        let part_info_old: PartInfo = serde_json::from_reader(File::open(part_file)?)?;
        fs::remove_file(part_file)?;

        let req = Request::get(uri.clone())
            .header(
                RANGE,
                format!(
                    "bytes={}-{}",
                    part_info_old.written_bytes, part_info_old.content_length
                ),
            )
            .body(Body::empty())?;
        println!("Request Debug: {:?}", req);
        let res = client.request(req).await?;

        if let Some(accept_ranges) = get_header_value(res.headers(), ACCEPT_RANGES) {
            if accept_ranges != "none" {
                let part_info = get_part_info_from_headers(res.headers());

                if part_info.file_modified == part_info_old.file_modified
                    && part_info.e_tag == part_info_old.e_tag
                {
                    return Ok((res, true));
                }
            }
        }

        Ok((res, false))
    } else {
        Ok((client.get(uri).await?, false))
    }
}

pub struct HttpDownloader {
    client: Client<HttpConnector>,
}

impl HttpDownloader {
    pub fn new() -> Self {
        HttpDownloader {
            client: Client::new(),
        }
    }
}

#[async_trait]
impl Downloader for HttpDownloader {
    async fn download_file(
        &self,
        state: &tauri::State<'_, ReplicArmaState>,
        window: &Arc<Mutex<usize>>,
        url: Url,
        destination: &Path,
    ) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(state, window, self.client.clone(), url, destination).await?)
    }

    async fn download_file_simple(&self, url: Url, destination: &Path) -> Result<()> {
        Ok(download_file_simple(self.client.clone(), url, destination).await?)
    }
}

pub struct HttpsDownloader {
    client: Client<HttpsConnector<HttpConnector>>,
}

impl HttpsDownloader {
    pub fn new() -> Self {
        let https = HttpsConnector::new();
        let client = Client::builder().build::<_, hyper::Body>(https);
        HttpsDownloader { client }
    }
}

#[async_trait]
impl Downloader for HttpsDownloader {
    async fn download_file(
        &self,
        state: &tauri::State<'_, ReplicArmaState>,
        window: &Arc<Mutex<usize>>,
        url: Url,
        destination: &Path,
    ) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(state, window, self.client.clone(), url, destination).await?)
    }

    async fn download_file_simple(&self, url: Url, destination: &Path) -> Result<()> {
        Ok(download_file_simple(self.client.clone(), url, destination).await?)
    }
}

pub async fn download_simple(url: &str, destination: &Path) -> Result<()> {
    let connection_info = Url::parse(url)?;
    let downloader: Box<dyn Downloader + Send + Sync> = match connection_info.scheme() {
        "http" => Box::new(HttpDownloader::new()),
        "https" => Box::new(HttpsDownloader::new()),
        "ftp" => todo!(),
        up => return Err(anyhow!("Unknown protocol/scheme: {}", up)),
    };

    downloader
        .download_file_simple(connection_info, destination)
        .await
}
