import { ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
import { spawn, Thread, Worker } from 'threads';
export const useHashStore = defineStore('hash', {
    state: (): {current: null|{ repoId: string; filesToCheck: number; checkedFiles: number; }, queue: { repoId: string; filesToCheck: number; checkedFiles: number; }[]} => ({
        current: null,
        queue: []
    }),
    getters: {
        getQueue: state => {
            return state.queue;
        },
        getWorker: async state => {
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
                const repo = repoStore.getRepo(this.current.repoId);
                if (repo === undefined) throw new Error(`Repository with id ${this.current.repoId} not found`);
                console.info(`Starting hash calc for repo ${repo.name}`);
                if (repo.files === undefined) throw new Error(`Repository with id ${this.current.repoId} has no files`);
                this.current.filesToCheck = repo.files.length;
                const filePathsWorker = await hashStore.getWorker;
                const filePaths = await filePathsWorker.prependFilePath(repo.files, settingsStore.settings.downloadDirectoryPath ?? '', System.SEPERATOR);
                const hashes = await System.hashCheck(filePaths);
                const fileChangesWorker = await hashStore.getWorker;
                const outDatedFiles = await fileChangesWorker.getFileChanges(repo.files, hashes[0]);
                const modsets = repo?.modsets ? Array.from(repo?.modsets?.values()) : [];
                for (const modset of modsets) {
                    await repoStore.getModsetStatus(repo.id, modset.id);
                }
                this.synchData();
                repoStore.saveRepoState();
                await hashStore.next();
                await Thread.terminate(filePathsWorker);
                await Thread.terminate(fileChangesWorker);
            }
        },
        async loadData () {
            // const cache = await System.getCache();
            // this.cache = new JSONMap(cache);
        },
        synchData () {
            // System.updateCache(this.cache);
        }
    }
});
