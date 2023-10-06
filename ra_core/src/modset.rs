
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ModsetMod {
    pub mod_type: String,
    pub name: String,
    pub allow_compat: Option<bool>,
}
