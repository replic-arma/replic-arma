/* eslint-disable camelcase */

import { GameLaunchSettings } from './Settings';

export interface File {
    path: string,
    size: number,
    sha1: string,
}

export interface ModsetMod {
    mod_type: string,
    name: string,
    allow_compat?: boolean,
}

export interface Modset {
    id: string;
    name: string,
    description?: string,
    status?: 'ready'|'outdated'|'checking'
    mods?: Array<ModsetMod>,
}

export interface GameServer {
    id: string,
    name: string,
    host: string,
    port: string,
    password?: string,
    modset?: string,
}

export interface DownloadServerOptions {
    max_connections: number
}

export interface DownloadServer {
    url: string,
    options: DownloadServerOptions,
}

export interface FileMap{
    foreign_hash: string,
    local_hash: string,
    file_found: boolean
}
export interface Collection {
    id: string;
    name: string,
    description?: string,
    modsets?: Map<string, Modset>
    dlc?: Array<string>,
    localMods?: Array<ModsetMod>
}

export class JSONMap<K extends string|number, V> extends Map<K, V> {
    public toJSON () {
        return Array.from(this.entries());
    }
}

export interface Repository {
    open_repository_schema: number,
    name: string,
    build_date: string,
    revision: number,
    files?: Array<File>,
    modsets?: JSONMap<string, Modset>,
    game_servers?: JSONMap<string, GameServer>,
    download_server?: DownloadServer,
    collections?: Map<string, Collection>
}

export interface ReplicArmaRepositoryError {
    message: string;
}

export interface ReplicArmaRepository extends Repository {
    config_url: string | undefined;
    id: string;
    image?: string;
    status: 'ready'|'outdated';
    error?: ReplicArmaRepositoryError;
    settings?: GameLaunchSettings;
    type: 'local'|'a3s'|'swifty';
    autoconfig?: string;
    revisionChanged: boolean;
    missingFiles?: Array<string>;
    outdatedFiles?: Array<string>;
}
