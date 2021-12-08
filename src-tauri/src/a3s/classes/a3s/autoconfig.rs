use super::super::java::JavaArrayList;
use crate::a3s::utils::{from_java_obj, FromJavaObject};
use jaded::{ConversionError, ConversionResult, FromValue, Value};
use url::Url;

/* --------------------------------------------------------------------- Protocol --------------------------------------------------------------------- */
#[derive(Debug)]
pub struct Protocol {
    pub login: String,
    pub password: String,
    pub url: String,
    pub port: String,
    pub read_time_out: String,
    pub protocol_type: String,
    pub connection_time_out: String,
}
impl FromValue for Protocol {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        return match value {
            Value::Object(data) => {
                let login = data.get_field_as("login")?;
                let password = data.get_field_as("password")?;
                let url = data.get_field_as("url")?;
                let port = data.get_field_as("port")?;
                let read_time_out = data.get_field_as("connectionTimeOut")?;
                let connection_time_out = data.get_field_as("readTimeOut")?;
                let protocol_type = data
                    .get_field("protocolType")
                    .unwrap()
                    .enum_data()
                    .1
                    .to_string();

                return Ok(Protocol {
                    login,
                    password,
                    url,
                    port,
                    read_time_out,
                    connection_time_out,
                    protocol_type,
                });
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        };
    }
}

impl Protocol {
    pub fn to_url(&self) -> Result<String, Box<dyn std::error::Error>> {
        let mut url = Url::parse("https://replic-arma.com").expect("Couldn't parse URL");

        if self.login.to_lowercase() != "anonymous" {
            let _result = url.set_username(&self.login);
            let _result = url.set_password(Some(&self.password));
        }

        fn set_scheme_and_port(
            url: &mut Url,
            default_port: u16,
            scheme: &str,
            protocole: &Protocol,
        ) -> Result<(), Box<dyn std::error::Error>> {
            let _result = url.set_scheme(scheme);

            let port: u16 = protocole.port.parse()?;

            if port == default_port {
                let _result = url.set_port(None);
            } else {
                let _result = url.set_port(Some(port));
            };

            Ok(())
        }

        match &self.protocol_type[..] {
            "FTP" => set_scheme_and_port(&mut url, 21, "ftp", self),
            "HTTP" => set_scheme_and_port(&mut url, 80, "http", self),
            "HTTPS" => set_scheme_and_port(&mut url, 443, "https", self),
            "SFTP" => set_scheme_and_port(&mut url, 22, "sftp", self),
            _ => Err(Box::<dyn std::error::Error>::from(
                "VERPISS DICH MIT DEINEM DRECKS PROTOCOL OIDAAA",
            )), // <-- actually richtig nice Fehler Meldung
        }?;

        let path;
        let host;

        match self.url.find('/') {
            Some(i) => {
                host = &self.url[..i];
                path = &self.url[i..];
            }
            None => {
                host = &self.url;
                path = "";
            }
        };

        url.set_host(Some(host))?;
        url.set_path(path);

        Ok(url.into_string())
    }
}

#[derive(Debug, Clone)]
pub struct FavoriteServer {
    pub name: String,
    pub ip_address: String,
    pub port: i32,
    pub password: String,
    pub selected: bool,
    pub modset_name: String,
    pub repository_name: String,
}

/* ----------------------------------------------------------------- Favorite Server ------------------------------------------------------------------ */
impl FromValue for FavoriteServer {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let name = data.get_field_as("name")?;
                let ip_address = data.get_field_as("ipAddress")?;
                let port = data.get_field_as("port")?;
                let password = data.get_field_as("password")?;
                let selected = data.get_field_as("selected")?;
                let modset_name = match data.get_field_as::<String>("modsetName") {
                    Ok(val) => val,
                    _ => String::from(""),
                };
                let repository_name = data.get_field_as("repositoryName")?;

                Ok(FavoriteServer {
                    name,
                    ip_address,
                    port,
                    password,
                    selected,
                    modset_name,
                    repository_name,
                })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

/* -------------------------------------------------------------------- AutoConfig -------------------------------------------------------------------- */
#[derive(Debug)]
pub struct AutoConfig {
    pub repository_name: String,
    pub protocol: Protocol,
    pub favorite_servers: Vec<FavoriteServer>,
}

impl FromValue for AutoConfig {
    fn from_value(value: &Value) -> ConversionResult<Self> {
        match value {
            Value::Object(data) => {
                let repository_name = data.get_field_as("repositoryName")?;
                let protocol: Protocol = data.get_field_as("protocole")?;

                let favorite_servers = data
                    .get_field_as::<JavaArrayList<FavoriteServer>>("favoriteServers")?
                    .value();

                Ok(AutoConfig {
                    repository_name,
                    protocol,
                    favorite_servers,
                })
            }
            Value::Null => Err(ConversionError::NullPointerException),
            _ => Err(ConversionError::InvalidType("object")),
        }
    }
}

impl FromJavaObject for AutoConfig {
    fn from_java_obj(slice: &[u8]) -> Result<Box<AutoConfig>, Box<dyn std::error::Error>> {
        from_java_obj(slice)
    }
}
