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
    description: string,
    status: string,
    mods?: Array<ModsetMod>,
}

export interface GameServer {
    name: string,
    host: string,
    port: string,
    password?: string,
    modset?: string,
}

export interface DownloadServerOptions {
    max_connections: number,
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

export interface Repository {
    open_repository_schema: number,
    name: string,
    build_date: string,
    files?: Array<File>,
    modsets?: Array<Modset>,
    game_servers?: Array<GameServer>,
    download_server?: DownloadServer,
}

export interface ReplicArmaRepositoryError {
    message: string;
}

export interface ReplicArmaRepository extends Repository {
    id: string;
    image?: string;
    status: 'ready'|'error'|'updating'|'queued'|'outdated';
    error?: ReplicArmaRepositoryError;
    settings?: GameLaunchSettings;
    type: 'local'|'a3s'|'swifty';
}
