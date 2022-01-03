use jaded::FromJava;

use crate::a3s::classes::java::{arraylist::ArrayList, date::JavaDate};

#[derive(Debug, Clone, FromJava)]
pub struct Changelogs {
    #[jaded(field = "list")]
    pub changelogs: ArrayList<Changelog>,
}

#[derive(Debug, Clone, FromJava)]
pub struct Changelog {
    pub revision: i32,
    #[jaded(field = "buildDate")]
    pub build_date: JavaDate,
    #[jaded(field = "contentUpdated")]
    pub content_updated: bool,
    #[jaded(field = "newAddons")]
    pub new_addons: ArrayList<String>,
    #[jaded(field = "updatedAddons")]
    pub updated_addons: ArrayList<String>,
    #[jaded(field = "deletedAddons")]
    pub deleted_addons: ArrayList<String>,
    pub addons: ArrayList<String>,
}
