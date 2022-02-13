import { JSONMap, ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
import { toRaw } from 'vue';
import { spawn, Worker } from 'threads';
export const useHashStore = defineStore('hash', {
    state: (): {current: null|{ repoId: string; filesToCheck: number; checkedFiles: number; }, queue: { repoId: string; filesToCheck: number; checkedFiles: number; }[], cache: JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>} => ({
        current: null,
        queue: [],
        cache: new JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>()
    }),
    getters: {
        getQueue: state => {
            return state.queue;
        },
        getWorker: async state => {
            debugger;
            return await spawn(new Worker('@/util/worker'));
        }
    },
    actions: {
        async startHash (repo: ReplicArmaRepository) {
            this.queue.push({ repoId: repo.id, filesToCheck: 1, checkedFiles: 1 });
            if (this.current === null) {
                this.next();
            }
        },
        async next () {
            this.current = null;
            if (this.queue.length > 0) {
                this.current = this.queue.splice(0, 1)[0];
                if (this.current === null) throw new Error('Current hash object empty');
                const hashStore = useHashStore();
                const settingsStore = useSettingsStore();
                const repoStore = useRepoStore();
                const repo = toRaw(repoStore.getRepo(this.current.repoId));
                if (repo === undefined) throw new Error(`Repository with id ${this.current.repoId} not found`);
                if (repo.files === undefined) throw new Error(`Repository with id ${this.current.repoId} has no files`);
                this.current.filesToCheck = repo.files.length;
                const filePaths = await (await hashStore.getWorker).prependFilePath(repo.files, settingsStore.settings.downloadDirectoryPath ?? '', System.SEPERATOR);
                const hashes = await toRaw(System.hashCheck(filePaths));
                const outDatedFiles = await (await hashStore.getWorker).getFileChanges(repo.files, hashes[0]);
                this.cache.set(repo.id, { checkedFiles: hashes[0], outdatedFiles: outDatedFiles, missingFiles: hashes[1] as unknown as string[] });
                const modsets = repo?.modsets ? Array.from(repo?.modsets?.values()) : [];
                modsets.forEach(async modset => await repoStore.getModsetStatus(repo.id, modset.id));
                this.synchData();
                repoStore.saveRepoState();
                await hashStore.next();
            }
        },
        async loadData () {
            const cache = await System.getCache();
            this.cache = new JSONMap(cache);
        },
        synchData () {
            System.updateCache(this.cache);
        }
    }
});
