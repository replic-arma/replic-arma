/* eslint-disable camelcase */
import { v4 as uuidv4 } from 'uuid';
import { useRepoStore } from '@/store/repo';
import type { GameLaunchSettings } from './Settings';
import { useHashStore } from '@/store/hash';
import { ReplicWorker } from '@/util/worker';
export interface File {
    path: string;
    size: number;
    sha1: string;
}

export interface ModsetMod {
    mod_type: string;
    name: string;
    allow_compat?: boolean;
    files?: File[];
    outdatedFiles?: [];
    missingFiles?: [];
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
    modsets?: Array<string>;
    dlc?: Array<string>;
    localMods?: Array<ModsetMod>;
}

export class JSONMap<K extends string | number, V> extends Map<K, V> {
    public toJSON(): [K, V][] {
        return Array.from(this.entries());
    }
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
    collections: Array<Collection>;
    config_url: string | undefined;
}

export interface ReplicArmaRepositoryError {
    message: string;
}

export interface IReplicArmaRepository extends Repository {
    id: string;
    image?: string;
    error?: ReplicArmaRepositoryError;
    settings?: GameLaunchSettings;
    type?: 'local' | 'a3s' | 'swifty';
    autoconfig?: string;
    revisionChanged?: boolean;
}
