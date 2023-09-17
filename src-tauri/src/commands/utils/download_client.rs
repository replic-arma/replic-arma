use anyhow::anyhow;
use anyhow::Result;
use async_trait::async_trait;

use hyper::body::HttpBody;
use hyper::client::connect::Connect;
use hyper::client::HttpConnector;
use hyper::header::HeaderName;
use hyper::header::ACCEPT_RANGES;
use hyper::http::HeaderValue;
use hyper::Body;
use hyper::Client;
use hyper::HeaderMap;
use hyper::Uri;
use hyper::{header::RANGE, Request};
use hyper_tls::HttpsConnector;
use std::{
    ffi::{OsStr, OsString},
    fs::File,
    io::Write,
    path::{Path, PathBuf},
    sync::Arc,
};
use tauri::async_runtime::Mutex;
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

#[async_trait]
pub trait Downloader: Send + Sync {
    async fn download_file(
        &self,
        downloading_state: &Mutex<Option<bool>>,
        total_written_bytes: &Arc<Mutex<usize>>,
        url: Url,
        destination: &Path,
    ) -> Result<()>;

    async fn download_partial(
        &self,
        downloading_state: &Mutex<Option<bool>>,
        total_written_bytes: &Arc<Mutex<usize>>,
        url: Url,
        range: (usize, usize),
    ) -> Result<Vec<u8>>;

    async fn download_file_simple(&self, url: Url, destination: &Path) -> Result<()>;

    fn clone_box(&self) -> Box<dyn Downloader>;
}

fn append_ext(ext: impl AsRef<OsStr>, path: PathBuf) -> PathBuf {
    let mut os_string: OsString = path.into();
    os_string.push(".");
    os_string.push(ext.as_ref());
    os_string.into()
}

async fn download_file<C>(
    downloading_state: &Mutex<Option<bool>>,
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

    let mut res = client.get(uri).await?;

    let mut _write_size: usize = 0;
    let mut bytes_written_complete: usize = 0;

    let mut out = File::create(destination)?;

    while let Some(next) = res.data().await {
        let chunk = next?;
        let chunk_len = chunk.len();

        _write_size += out.write(&chunk)?;

        *total_written_bytes.lock().await += chunk_len;
        bytes_written_complete += chunk_len;

        let keep_downloading = (*downloading_state.lock().await).unwrap_or(true);
        if !keep_downloading {
            break;
        }
    }
    Ok(())
}

async fn download_file_partial<C>(
    downloading_state: &Mutex<Option<bool>>,
    total_written_bytes: &Arc<Mutex<usize>>,
    client: Client<C>,
    url: Url,
    range: (usize, usize),
) -> Result<Vec<u8>>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let uri: Uri = url.as_str().parse::<_>()?;

    let req = Request::get(uri.clone())
        .header(RANGE, format!("bytes={}-{}", range.0, range.1))
        .body(Body::empty())?;
    // dbg!(format!("Request Debug: {:?}", req));
    let mut res = client.request(req).await?;
    // dbg!(format!("Response Debug: {:?}", res));

    if !(get_header_value(res.headers(), ACCEPT_RANGES).unwrap_or_default() != "none") {
        return Err(anyhow!("Server not configured for range requests!"));
    }

    let mut _write_size: usize = 0;
    let mut bytes_written_complete: usize = 0;

    let mut out: Vec<u8> = Vec::with_capacity(range.1 - range.0);

    while let Some(next) = res.data().await {
        let chunk = next?;
        let chunk_len = chunk.len();

        _write_size += out.write(&chunk)?;

        *total_written_bytes.lock().await += chunk_len;
        bytes_written_complete += chunk_len;

        let keep_downloading = (*downloading_state.lock().await).unwrap_or(true);
        if !keep_downloading {
            break;
        }
    }
    Ok(out)
}

async fn download_file_simple<C>(client: Client<C>, url: Url, destination: &Path) -> Result<()>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let uri: Uri = url.as_str().parse::<_>()?;
    let mut res = client.get(uri).await?;

    let mut _write_size: usize = 0;

    let mut out = File::create(destination)?;

    while let Some(next) = res.data().await {
        let chunk = next?;
        _write_size += out.write(&chunk)?;
    }

    Ok(())
}

#[derive(Clone)]
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
        downloading_state: &Mutex<Option<bool>>,
        window: &Arc<Mutex<usize>>,
        url: Url,
        destination: &Path,
    ) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(
            downloading_state,
            window,
            self.client.clone(),
            url,
            destination,
        )
        .await?)
    }

    async fn download_file_simple(&self, url: Url, destination: &Path) -> Result<()> {
        Ok(download_file_simple(self.client.clone(), url, destination).await?)
    }

    async fn download_partial(
        &self,
        downloading_state: &Mutex<Option<bool>>,
        total_written_bytes: &Arc<Mutex<usize>>,
        url: Url,
        range: (usize, usize),
    ) -> Result<Vec<u8>> {
        Ok(download_file_partial(
            downloading_state,
            total_written_bytes,
            self.client.clone(),
            url,
            range,
        )
        .await?)
    }

    fn clone_box(&self) -> Box<dyn Downloader> {
        Box::new(self.clone())
    }
}

#[derive(Clone)]
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
        downloading_state: &Mutex<Option<bool>>,
        window: &Arc<Mutex<usize>>,
        url: Url,
        destination: &Path,
    ) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(
            downloading_state,
            window,
            self.client.clone(),
            url,
            destination,
        )
        .await?)
    }

    async fn download_file_simple(&self, url: Url, destination: &Path) -> Result<()> {
        Ok(download_file_simple(self.client.clone(), url, destination).await?)
    }

    async fn download_partial(
        &self,
        downloading_state: &Mutex<Option<bool>>,
        total_written_bytes: &Arc<Mutex<usize>>,
        url: Url,
        range: (usize, usize),
    ) -> Result<Vec<u8>> {
        Ok(download_file_partial(
            downloading_state,
            total_written_bytes,
            self.client.clone(),
            url,
            range,
        )
        .await?)
    }

    fn clone_box(&self) -> Box<dyn Downloader> {
        Box::new(self.clone())
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
