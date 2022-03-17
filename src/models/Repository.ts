/* eslint-disable camelcase */
import { v4 as uuidv4 } from 'uuid';
import { useRepoStore } from '@/store/repo';
import { GameLaunchSettings } from './Settings';
import { useHashStore } from '@/store/hash';
import { System } from '@/util/system';
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
    modsets: JSONMap<string, Modset>;
    game_servers?: JSONMap<string, GameServer>;
    download_server?: DownloadServer;
    collections?: JSONMap<string, Collection>;
}

export interface ReplicArmaRepositoryError {
    message: string;
}

export interface IReplicArmaRepository extends Repository {
    config_url: string | undefined;
    id: string;
    image?: string;
    error?: ReplicArmaRepositoryError;
    settings?: GameLaunchSettings;
    type?: 'local' | 'a3s' | 'swifty';
    autoconfig?: string;
    revisionChanged?: boolean;
}
export class ReplicArmaRepository {
    public static async init(repo: Repository): Promise<IReplicArmaRepository> {
        const repository = repo as unknown as IReplicArmaRepository;
        repository.id = uuidv4();
        if (repository.image === undefined)
            repository.image =
                'https://cdn.discordapp.com/channel-icons/834500277582299186/62046f86f4013c9a351b457edd4199b4.png?size=32' ??
                repository.image;
        repository.settings = new GameLaunchSettings();
        repository.type = 'a3s';
        repository.collections = new JSONMap<string, Collection>();
        repository.modsets = await ReplicArmaRepository.initModsets(repository);
        ReplicArmaRepository.save(repository);
        return repository;
    }

    public static async loadFromJson(repo: IReplicArmaRepository, calcHash = false): Promise<void> {
        repo.collections =
            repo.collections !== undefined
                ? new JSONMap<string, Collection>(repo.collections)
                : new JSONMap<string, Collection>();
        repo.modsets = new JSONMap<string, Modset>(repo.modsets);
        ReplicArmaRepository.save(repo);
        if (calcHash) {
            ReplicArmaRepository.calcHash(repo);
        }
    }

    private static async initModsets(repo: IReplicArmaRepository): Promise<JSONMap<string, Modset>> {
        const modsets = new JSONMap<string, Modset>();
        const modsetDataMap = new JSONMap<string, Modset>();
        const repoModsets = Array.from(repo.modsets as unknown as Modset[]);
        let mods = [];
        if (repoModsets.length === 0 && repo.files !== undefined) {
            mods = await ReplicWorker.createModsetFromFiles(repo.files);
        } else {
            mods = await ReplicWorker.createModsetFromModset(repoModsets);
        }
        repoModsets.unshift({
            id: uuidv4(),
            name: 'All Mods',
            description: 'Contains all Mods from the Repository',
            mods,
        });
        repoModsets.map(async (repoModset: Modset) => {
            repoModset.id = uuidv4();
            modsets.set(repoModset.id, repoModset);
        });
        if (repo.files === undefined) throw new Error('No Files!');
        const modsetData: Modset[] = await ReplicWorker.mapFilesToMods(repo.files, Array.from(modsets.values()));
        for (const modset of modsetData) {
            modsetDataMap.set(modset.id, modset);
        }
        const repoStore = useRepoStore();
        repoStore.addToModsetCache(modsetDataMap);
        System.updateModsetCache(repo.id, modsetDataMap);
        return modsets;
    }

    public static async calcHash(repo: IReplicArmaRepository): Promise<void> {
        const hashStore = useHashStore();
        const repoStore = useRepoStore();
        const cacheData = await System.getModsetCache(repo.id);
        repoStore.addToModsetCache(new JSONMap<string, Modset>(cacheData));
        hashStore.startHash(repo);
    }

    public static async save(repo: IReplicArmaRepository): Promise<void> {
        const repoStore = useRepoStore();
        repoStore.repos.set(repo.id, repo);
    }

    public static async connectToAutoConfig(repo: IReplicArmaRepository): Promise<Repository> {
        return await System.getRepo(`${repo.config_url}autoconfig`);
    }
}
