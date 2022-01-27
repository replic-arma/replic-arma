use std::fmt::Display;

use crate::a3s::classes::java::arraylist::ArrayList;
use jaded::{ConversionResult, FromJava};

#[derive(Debug, FromJava)]
pub struct AutoConfig {
    #[jaded(field = "repositoryName")]
    pub repository_name: String,
    #[jaded(field = "protocole")]
    pub protocol: Protocol,
    #[jaded(field = "favoriteServers")]
    pub favorite_servers: ArrayList<FavoriteServer>,
}

#[derive(Debug, FromJava)]
pub struct Protocol {
    pub login: String,
    pub password: String,
    pub url: String,
    pub port: String,
    #[jaded(field = "readTimeOut")]
    pub read_time_out: String,
    #[jaded(field = "protocolType")] //, extract(read_protocol_type))]
    pub protocol_type: ProtocolTypeJava,
    #[jaded(field = "connectionTimeOut")]
    pub connection_time_out: String,
}

#[derive(Debug)]
pub struct ProtocolTypeJava {
    protocol_type: ProtocolType,
}

impl FromJava for ProtocolTypeJava {
    fn from_value(value: &jaded::Value) -> ConversionResult<Self> {
        Ok(value.enum_data().1.into())
    }
}

impl From<String> for ProtocolTypeJava {
    fn from(string: String) -> Self {
        string.into()
    }
}

impl From<&str> for ProtocolTypeJava {
    fn from(string: &str) -> Self {
        let protocol_type = match string {
            "FTP" => ProtocolType::FTP,
            "HTTP" => ProtocolType::HTTP,
            "HTTPS" => ProtocolType::HTTPS,
            "A3S" => ProtocolType::A3S,
            "SOCKS4" => ProtocolType::SOCKS4,
            "SOCKS5" => ProtocolType::SOCKS5,
            "HTTP/WEBDAV" => ProtocolType::HTTPWEBDAV,
            "HTTPS/WEBDAV" => ProtocolType::HTTPSWEBDAV,
            _ => ProtocolType::UNKNOWN,
        };
        ProtocolTypeJava { protocol_type }
    }
}

impl Display for ProtocolTypeJava {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self.protocol_type)
    }
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Debug)]
pub enum ProtocolType {
    FTP,         // FTP("FTP", "ftp://", "21")
    HTTP,        // HTTP("HTTP", "http://", "80")
    HTTPS,       // HTTPS("HTTPS", "https://", "443")
    A3S,         // A3S("A3S", "a3s://", "")
    SOCKS4,      // SOCKS4("SOCKS4", "socks4://", "1080")
    SOCKS5,      // SOCKS5("SOCKS5", "socks5://", "1080")
    HTTPWEBDAV,  // HTTP_WEBDAV("HTTP/WEBDAV", "http://", "80")
    HTTPSWEBDAV, // HTTPS_WEBDAV("HTTPS/WEBDAV","https://", "443")
    UNKNOWN,
}

#[derive(Debug, Clone, FromJava)]
pub struct FavoriteServer {
    pub name: String,
    #[jaded(field = "ipAddress")]
    pub ip_address: String,
    pub port: i32,
    pub password: String,
    pub selected: bool,
    #[jaded(field = "modsetName")]
    pub modset_name: String,
    #[jaded(field = "repositoryName")]
    pub repository_name: String,
}
