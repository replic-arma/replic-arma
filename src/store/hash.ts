import { JSONMap, ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
import { spawn, Thread, Worker } from 'threads';
import { toRaw } from 'vue';
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
        getWorker: async () => {
            return await spawn(new Worker('@/util/worker'));
        }
    },
    actions: {
        async startHash (repo: ReplicArmaRepository) {
            console.info(`Repository ${repo.name} has been queued`);
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
                console.info(`Starting hash calc for repo ${repo.name}`);
                if (repo.files === undefined) throw new Error(`Repository with id ${this.current.repoId} has no files`);
                this.current.filesToCheck = repo.files.length;
                const hashes = await System.hashCheck(`${settingsStore.settings.downloadDirectoryPath ?? ''}${System.SEPERATOR}`, repo.files);
                const fileChangesWorker = await hashStore.getWorker;
                const outDatedFiles = await fileChangesWorker.getFileChanges(repo.files, hashes[0]);
                const modsets = repo?.modsets ? Array.from(repo?.modsets?.values()) : [];
                this.cache.set(repo.id, { checkedFiles: hashes[0], outdatedFiles: outDatedFiles, missingFiles: hashes[1] as unknown as string[] });
                for (const modset of modsets) {
                    const cached = toRaw(hashStore.cache.get(this.current.repoId));
                    if (cached?.checkedFiles === undefined) throw new Error('cache empty!');
                    const fileChangesWorker = await hashStore.getWorker;
                    const modsetFiles = await fileChangesWorker.getFilesForModset(toRaw(repoStore.modsetCache.get(modset.id)));
                    const outDatedFiles = await fileChangesWorker.isFileIn(modsetFiles, cached?.outdatedFiles);
                    const missingFiles = await fileChangesWorker.isFileIn(modsetFiles, cached?.missingFiles);
                    hashStore.cache.set(modset.id, { checkedFiles: cached?.checkedFiles, outdatedFiles: outDatedFiles, missingFiles: missingFiles });
                }
                console.info(`Finished hash calc for repo ${repo.name}`);
                Promise.all([repoStore.saveRepoState(), hashStore.next()]);
            }
        }
    }
});
