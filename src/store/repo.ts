import { Collection, GameServer, JSONMap, Modset, ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { useHashStore } from './hash';
import { toRaw } from 'vue';
export const useRepoStore = defineStore('repo', {
    state: (): {repos: JSONMap<string, ReplicArmaRepository>, currentRepoId: string|null, currentModsetId: string|null, currentCollectionId: string|null, currentModId: string|null} => ({
        repos: new JSONMap<string, ReplicArmaRepository>(),
        currentRepoId: null,
        currentModsetId: null,
        currentCollectionId: null,
        currentModId: null
    }),
    getters: {
        getRepos: (state) => {
            return toRaw(Array.from(state.repos.values()));
        },
        getRepo: (state) => {
            return (repoId: string|null) => repoId !== null ? state.repos.get(repoId) : undefined;
        },
        getModsets: (state) => {
            return (repoId: string|null) => repoId !== null ? Array.from(state.repos.get(repoId)?.modsets?.values() ?? []) : [];
        },
        getModset: (state) => {
            return (repoId: string|null, modsetId: string|null) => repoId !== null && modsetId !== null ? state.repos.get(repoId)?.modsets?.get(modsetId) : undefined;
        },
        getCollections: (state) => {
            return (repoId: string|null) => repoId !== null ? Array.from(state.repos.get(repoId)?.collections?.values() ?? []) : [];
        },
        getCollection: (state) => {
            return (repoId: string|null, collectionId: string|null) => repoId !== null && collectionId !== null ? state.repos.get(repoId)?.collections?.get(collectionId) : undefined;
        },
        getModsetStatus: (state) => {
            return async (repoId: string|null, modsetId: string|null) => {
                // const hashStore = useHashStore();
                // if (repoId === null) throw new Error('Repository id is null');
                // if (modsetId === null) throw new Error('Modset id is null');
                // const repo = toRaw(state.repos.get(repoId));
                // if (repo === undefined) throw new Error(`Repository with id ${repoId} does not exist`);
                // const modset = repo.modsets?.get(modsetId);
                // if (modset === undefined) throw new Error(`Modset with id ${modsetId} does not exist`);
                // modset.status = 'checking';
                // repo.modsets?.set(modset.id, modset);
                // state.repos.set(repo.id, repo);
                // // let cached = toRaw(hashStore.cache.get(modsetId));
                // if (cached === undefined) {
                //     // cached = toRaw(hashStore.cache.get(repoId));
                //     const modsetFiles = await toRaw(System.getFilesForModset(repoId, modsetId));
                //     if (cached?.checkedFiles === undefined) throw new Error('cache empty!');
                //     const fileChangesWorker = await hashStore.getWorker;
                //     const outDatedFiles = await fileChangesWorker.getFileChanges(modsetFiles, cached?.checkedFiles);
                //     // await Thread.terminate(fileChangesWorker);
                //     // hashStore.cache.set(modsetId, { checkedFiles: cached?.checkedFiles, missingFiles: cached.missingFiles, outdatedFiles: outDatedFiles });
                // }
                // cached = hashStore.cache.get(modsetId);
                // if (cached === undefined) throw new Error('Cache empty');
                // if (cached?.outdatedFiles.length > 0 || cached.missingFiles.length > 0) {
                //     modset.status = 'outdated';
                // } else {
                //     modset.status = 'ready';
                // }
                // repo.modsets?.set(modset.id, modset);
                // repo.save();
            };
        }
    },
    actions: {
        async addRepo (autoconfig: string) {
            const repo = await System.getRepo(autoconfig);
            const replicRepo = new ReplicArmaRepository();
            await replicRepo.init(repo);
            replicRepo.calcHash();
            this.saveRepoState();
        },
        removeRepo (id: string|null) {
            if (id !== null) this.repos.delete(id);
            this.saveRepoState();
            this.loadRepositories();
        },
        addServerToRepo (id: string, server: GameServer) {
            const repositoriy = this.repos.get(id);
            server.id = uuidv4();
            repositoriy?.game_servers?.set(server.id, server);
            if (repositoriy === undefined) return;
            this.repos.set(id, repositoriy);
        },
        addModsetToRepo (id: string|null, modset: Modset) {
            if (id === null) throw new Error('Repository id is null');
            const repositoriy = this.repos.get(id);
            if (repositoriy === undefined) throw new Error(`Repository with id ${id} does not exist`);
            modset.id = uuidv4();
            repositoriy.modsets?.set(modset.id, modset);
            this.repos.set(id, repositoriy);
        },
        addCollectionToRepo (id: string|null, collection: Collection) {
            if (id === null) throw new Error('Repository id is null');
            const repositoriy = this.repos.get(id);
            if (repositoriy === undefined) throw new Error(`Repository with id ${id} does not exist`);
            collection.id = uuidv4();
            if (repositoriy.collections === undefined) {
                repositoriy.collections = new JSONMap<string, Collection>();
            }
            repositoriy.collections?.set(collection.id, collection);
            this.repos.set(id, repositoriy);
        },
        async loadRepositories () {
            const repoJson = await System.getRepoJson();

            if (repoJson !== null) {
                const repoMap = new JSONMap<string, ReplicArmaRepository>(repoJson);
                repoMap.forEach(repo => {
                    new ReplicArmaRepository().loadFromJson(repo);
                });
            }
        },
        async saveRepoState () {
            System.updateRepoJson(this.repos);
        }
    }
});
