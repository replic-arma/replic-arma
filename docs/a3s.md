# A3S Internal Structure and Types

A3SRepository
````
auto_config: AutoConfig
changelogs: Changelogs
sync: SyncTreeDirectory
server_info: ServerInfo
events: Events
````
Changelogs
````
list: Vec<Changelog>
````

Changelog
````
revision: i32
build_date: DateTime<Utc>
addons: Vec<String>
new_addons: Vec<String>
deleted_addons: Vec<String>
updated_addons: Vec<String>
content_updated: bool
````

Events
````
list: Vec<Events>
````

Event
````
name: String
description: String
addon_names: HashMap<String, bool>
userconfig_folder_names: HashMap<String, bool>
````

ServerInfo
````
revision: i32
build_date: DateTime<Utc>
number_of_files: i64
total_file_size: i64
hidden_folder_paths: HashSet<String>
number_of_connections: i32
no_partial_file_transfer: bool
repository_content_updated: bool
compressed_pbo_files_only: bool
````

SyncTreeList
````
file_list: Vec<SyncTreeLeaf>
directory_list: Vec<SyncTreeDirectory>
````

SyncTreeLeaf
````
name: String
sha1: String
size: i64
compressed_size: i64
updated: bool
deleted: bool
compressed: bool
````

SyncTreeDirectory
````
name: String
mark_as_addon: bool
updated: bool
deleted: bool
hidden: bool
file_list: Vec<SyncTreeLeaf>
directory_list: Vec<SyncTreeDirectory>
````