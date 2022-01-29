use std::{fs::File, io::Write, path::Path};

use anyhow::Result;
use async_trait::async_trait;
use hyper::{
    body::HttpBody,
    client::{connect::Connect, HttpConnector},
    Client,
};
use hyper_tls::HttpsConnector;
use url::Url;

#[async_trait]
pub trait Downloader {
    async fn download_file(&self, url: Url, destination: &Path) -> Result<()>;
}

async fn download_file<C>(client: Client<C>, url: Url, destination: &Path) -> Result<()>
where
    C: Connect + Clone + Send + Sync,
    C: 'static,
{
    let uri = url.as_str().parse::<_>()?;

    let mut res = client.get(uri).await?;
    let mut out = File::create(destination)?;
    let mut _write_size: usize = 0;
    // let mut hash = Sha1::new();
    while let Some(next) = res.data().await {
        let chunk = next?;
        _write_size += out.write(&chunk)?;
        // hash.update(&chunk);
    }

    // let sha1 = hash.finalize();
    Ok(())
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
    async fn download_file(&self, url: Url, destination: &Path) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(self.client.clone(), url, destination).await?)
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
    async fn download_file(&self, url: Url, destination: &Path) -> Result<()> {
        // Client is cheap to clone and cloning is the recommended way to share a Client.
        // The underlying connection pool will be reused.
        Ok(download_file(self.client.clone(), url, destination).await?)
    }
}
