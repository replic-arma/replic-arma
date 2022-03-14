import { Collection, type GameServer, JSONMap, type Modset, ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { toRaw } from 'vue';
import { useHashStore } from './hash';
export const useRepoStore = defineStore('repo', {
    state: (): {
        repos: JSONMap<string, ReplicArmaRepository>;
        currentRepoId: string | null;
        currentModsetId: string | null;
        currentCollectionId: string | null;
        currentModId: string | null;
        modsetCache: JSONMap<string, Modset>;
    } => ({
        repos: new JSONMap<string, ReplicArmaRepository>(),
        currentRepoId: null,
        currentModsetId: null,
        currentCollectionId: null,
        currentModId: null,
        modsetCache: new JSONMap<string, Modset>(),
    }),
    getters: {
        getRepos: (state) => {
            return toRaw(Array.from(state.repos.values()));
        },
        getRepo: (state) => {
            return (repoId: string | null) => (repoId !== null ? state.repos.get(repoId) : undefined);
        },
        getModsets: (state) => {
            return (repoId: string | null) =>
                repoId !== null ? Array.from(state.repos.get(repoId)?.modsets?.values() ?? []) : [];
        },
        getModset: (state) => {
            return (repoId: string | null, modsetId: string | null) =>
                repoId !== null && modsetId !== null ? state.repos.get(repoId)?.modsets?.get(modsetId) : undefined;
        },
        getCollections: (state) => {
            return (repoId: string | null) =>
                repoId !== null ? Array.from(state.repos.get(repoId)?.collections?.values() ?? []) : [];
        },
        getCollection: (state) => {
            return (repoId: string | null, collectionId: string | null) =>
                repoId !== null && collectionId !== null
                    ? state.repos.get(repoId)?.collections?.get(collectionId)
                    : undefined;
        },
        getModsetStatus: () => {
            return (modsetId: string | null) => {
                const hashStore = useHashStore();
                const cache = hashStore.cache.get(modsetId ?? '');
                if (cache === undefined) return 'checking';
                if (cache?.outdatedFiles.length > 0 || cache?.missingFiles.length > 0) {
                    return 'outdated';
                } else {
                    return 'ready';
                }
            };
        },
    },
    actions: {
        async addRepo(autoconfig: string) {
            const repo = await System.getRepo(autoconfig);
            const replicRepo = new ReplicArmaRepository();
            await replicRepo.init(repo);
            replicRepo.calcHash();
            this.saveRepoState();
        },
        async removeRepo(id: string | null) {
            if (id !== null) this.repos.delete(id);
            await this.saveRepoState();
            await this.loadRepositories();
        },
        addServerToRepo(id: string, server: GameServer) {
            const repositoriy = this.repos.get(id);
            server.id = uuidv4();
            repositoriy?.game_servers?.set(server.id, server);
            if (repositoriy === undefined) return;
            this.repos.set(id, repositoriy);
        },
        addModsetToRepo(id: string | null, modset: Modset) {
            if (id === null) throw new Error('Repository id is null');
            const repositoriy = this.repos.get(id);
            if (repositoriy === undefined) throw new Error(`Repository with id ${id} does not exist`);
            modset.id = uuidv4();
            repositoriy.modsets?.set(modset.id, modset);
            this.repos.set(id, repositoriy);
        },
        addCollectionToRepo(id: string | null, collection: Collection) {
            if (id === null) throw new Error('Repository id is null');
            const repositoriy = this.repos.get(id);
            if (repositoriy === undefined) throw new Error(`Repository with id ${id} does not exist`);
            collection.id = uuidv4();
            if (repositoriy.collections === undefined) {
                repositoriy.collections = new JSONMap<string, Collection>();
            }
            repositoriy.collections?.set(collection.id, collection);
            this.repos.set(id, repositoriy);
            this.saveRepoState();
        },
        addToModsetCache(cache: JSONMap<string, Modset>) {
            this.modsetCache = new JSONMap<string, Modset>([...toRaw(this.modsetCache), ...cache]);
        },
        async loadRepositories(calcHash = false) {
            const repoJson = await System.getRepoJson();
            if (repoJson !== null) {
                const repoMap = new JSONMap<string, ReplicArmaRepository>(repoJson);
                repoMap.forEach((repo) => {
                    new ReplicArmaRepository().loadFromJson(repo, calcHash);
                });
            }
        },
        async saveRepoState() {
            await System.updateRepoJson(this.repos);
        },
    },
});
