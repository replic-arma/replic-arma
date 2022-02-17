/* eslint-disable camelcase */
import { v4 as uuidv4 } from 'uuid';
import { useRepoStore } from '@/store/repo';
import { GameLaunchSettings } from './Settings';
import { useHashStore } from '@/store/hash';
import { Thread } from 'threads';
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

export class Modset {
    public id!: string;
    public name!: string;
    public description?: string;
    public status?: 'ready'|'outdated'|'checking'|'unknown';
    public mods?: Array<ModsetMod>;

    public async init (modset: any): Promise<void> {
        this.id = uuidv4();
        this.name = modset.name;
        this.description = modset.description;
        this.status = modset.status ?? 'unknown';
        this.mods = modset.mods;
    }

    public async loadFromJson (modset: any): Promise<void> {
        this.id = modset.id;
        this.name = modset.name;
        this.description = modset.description;
        this.status = modset.status ?? 'unknown';
        this.mods = modset.mods !== undefined ? modset.mods : [];
    }
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

export class FileMap {
    public foreign_hash!: string;
    public local_hash!: string;
    public file_found!: boolean;
}
export class Collection {
    public id!: string;
    public name!: string;
    public description?: string;
    public modsets?: Map<string, Modset>;
    public dlc?: Array<string>;
    public localMods?: Array<ModsetMod>;

    constructor (collection: Collection) {
        this.id = collection.id ?? uuidv4();
        this.name = collection.name;
        this.description = collection.description;
        this.dlc = collection.dlc;
        this.modsets = collection.modsets;
        this.localMods = collection.localMods;
    }
}

export class JSONMap<K extends string|number, V> extends Map<K, V> {
    public toJSON (): [K, V][] {
        return Array.from(this.entries());
    }
}

export class Repository {
    public open_repository_schema!: number;
    public name!: string;
    public build_date!: string;
    public revision!: number;
    public files?: Array<File>;
    public modsets?: JSONMap<string, Modset>;
    public game_servers?: JSONMap<string, GameServer>;
    public download_server?: DownloadServer;
    public collections?: Map<string, Collection>;
}

export interface ReplicArmaRepositoryError {
    message: string;
}

export class ReplicArmaRepository extends Repository {
    public config_url: string | undefined;
    public id!: string;
    public image?: string;
    public status?: 'ready'|'outdated'|'checking';
    public error?: ReplicArmaRepositoryError;
    public settings?: GameLaunchSettings;
    public type?: 'local'|'a3s'|'swifty';
    public autoconfig?: string;
    public revisionChanged?: boolean;

    public async init (repo: any): Promise<void> {
        this.id = uuidv4();
        if (repo.image === undefined) this.image = 'https://cdn.discordapp.com/channel-icons/834500277582299186/62046f86f4013c9a351b457edd4199b4.png?size=32' ?? repo.image;
        this.name = repo.name;
        this.settings = new GameLaunchSettings();
        this.type = 'a3s';
        this.files = repo.files;
        this.collections = await this.loadCollections(repo);
        this.modsets = await this.initModsets(repo);
        this.download_server = repo.download_server;
        this.game_servers = repo.game_servers;
        this.revision = repo.revision;
        this.build_date = repo.build_date;
        this.config_url = repo.config_url;
        this.save();
    }

    public async loadFromJson (repo: any) {
        this.id = repo.id;
        this.name = repo.name;
        this.image = repo.image;
        this.settings = repo.settings;
        this.type = repo.type;
        this.files = repo.files;
        // this.collections = await this.loadCollections(repo);
        this.modsets = await this.loadModsets(repo);
        this.download_server = repo.download_server;
        this.game_servers = repo.game_servers;
        this.revision = repo.revision;
        this.build_date = repo.build_date;
        this.config_url = repo.config_url;
        this.save();
    }

    private async initModsets (repo: ReplicArmaRepository): Promise<JSONMap<string, Modset>> {
        const modsets = new JSONMap<string, Modset>();
        const modWorker = await useHashStore().getWorker;
        repo.modsets = await modWorker.mapFilesToMods(repo.files, repo.modsets);
        Array.from(repo.modsets as unknown as Modset[]).map(async (repoModset: Modset) => {
            const modset = new Modset();
            await modset.init(repoModset);
            modsets.set(modset.id, modset);
        });
        await Thread.terminate(modWorker);
        return modsets;
    }

    private async loadModsets (repo: {modsets: [string, Modset][]} | undefined): Promise<JSONMap<string, Modset>> {
        const modsets = new JSONMap<string, Modset>();
        if (repo === undefined) throw new Error('Repo undefined');
        for (const [id, repoModset] of repo.modsets) {
            const modset = new Modset();
            await modset.loadFromJson(repoModset);
            modsets.set(modset.id, modset);
        }
        return modsets;
    }

    private async loadCollections (repo: any | undefined): Promise<JSONMap<string, Collection>> {
        if (repo.collections !== undefined) {
            const collections = Array.from(repo.collections as unknown as Collection[]).map((collection: Collection) => { return new Collection(collection); });
            repo.collections = new JSONMap<string, Collection>();
            collections.map(collection => repo.collections?.set(collection.id, collection));
        } else {
            repo.collections = new JSONMap<string, Collection>();
        }
        return repo.collections;
    }

    public calcHash (): void {
        const hashStore = useHashStore();
        this.status = 'checking';
        this.save();
        hashStore.startHash(this);
    }

    public save (): void {
        const repoStore = useRepoStore();
        repoStore.repos.set(this.id, this);
    }
}
