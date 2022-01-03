use jaded::FromJava;

use crate::a3s::classes::java::{arraylist::ArrayList, hashmap::JavaHashMap};

#[derive(Debug, Clone, FromJava)]
pub struct Events {
    #[jaded(field = "list")]
    pub events: ArrayList<Event>,
}

#[derive(Debug, Clone, FromJava)]
pub struct Event {
    pub name: String,
    pub description: String,
    #[jaded(field = "addonNames")]
    pub addon_names: JavaHashMap<String, bool>,
    #[jaded(field = "userconfigFolderNames")]
    pub userconfig_folder_names: JavaHashMap<String, bool>,
}
