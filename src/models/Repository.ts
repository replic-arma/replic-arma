/* eslint-disable camelcase */
import type { GameLaunchSettings } from './Settings';
export type ModsetMap = Record<string, string[]>;
export interface File {
    path: string;
    size: number;
    sha1: string;
}

export interface Mod {
    mod_type: string;
    name: string;
    path?: string;
}

export interface ModsetMod extends Mod {
    allow_compat?: boolean;
    files?: File[];
    outdatedFiles?: [];
    missingFiles?: [];
    size?: number;
}

export interface Modset {
    id: string;
    name: string;
    description?: string;
    mods: Array<ModsetMod>;
}

export interface GameServer {
    id: string;
    name: string;
    host: string;
    port: string;
    password?: string;
    modset?: string;
}

export interface DownloadServerOptions {
    max_connections: number;
}

export interface DownloadServer {
    url: string;
    options: DownloadServerOptions;
}

export interface FileMap {
    foreign_hash: string;
    local_hash: string;
    file_found: boolean;
}
export interface Collection {
    id: string;
    name: string;
    description?: string;
    modsets: ModsetMap;
    dlc?: Array<string>;
    localMods?: Array<Mod>;
    launchOptions?: GameLaunchSettings;
}

export class JSONMap<K extends string | number, V> extends Map<K, V> {
    public toJSON(): [K, V][] {
        return Array.from(this.entries());
    }
}

export interface ConnectionSettings {
    config_url: string;
    host_url: string;
    protocol: 'http' | 'https' | 'ftp';
    username?: string;
    password?: string;
    port?: string;
}
export interface Repository {
    open_repository_schema: number;
    name: string;
    build_date: string;
    revision: number;
    files: Array<File>;
    modsets: Array<Modset>;
    game_servers?: Array<GameServer>;
    download_server?: DownloadServer;
    config_url: string | undefined;
    connection?: ConnectionSettings;
}

export interface ReplicArmaRepositoryError {
    message: string;
}

export enum RepositoryType {
    A3S = 'A3S',
    SWIFTY = 'swifty',
    LOCAL = 'local'
}

export enum HashStatus {
    UNKNOWN = 'unknown',
    OUTDATED = 'outdated',
    READY = 'ready',
    CHECKING = 'checking',
    QUEUED = 'queued'
}
export interface IReplicArmaRepository extends Repository {
    id: string;
    image?: string;
    error?: ReplicArmaRepositoryError;
    settings?: GameLaunchSettings;
    type?: RepositoryType;
    launchOptions?: GameLaunchSettings;
    downloadDirectoryPath: string;
    collections: Array<Collection>;
}
