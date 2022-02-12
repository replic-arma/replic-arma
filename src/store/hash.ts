import { File, JSONMap, ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
/* eslint-disable import/no-webpack-loader-syntax, import/default */
import filePathWorkerUrl from 'worker-plugin/loader!@/worker/filePath.worker';
import fileChangesWorkerUrl from 'worker-plugin/loader!@/worker/fileChanges.worker';
import { promisifyWorker } from '@/util/worker';
/* eslint-enable import/no-webpack-loader-syntax, import/default */

export const useHashStore = defineStore('hash', {
    state: (): {current: null|{ repoId: string; filesToCheck: number; checkedFiles: number; }, queue: { repoId: string; filesToCheck: number; checkedFiles: number; }[], cache: JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>} => ({
        current: null,
        queue: [],
        cache: new JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>()
    }),
    getters: {
        getQueue: (state) => {
            return state.queue;
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
                const repo = repoStore.getRepo(this.current.repoId);
                if (repo === undefined) throw new Error(`Repository with id ${this.current.repoId} not found`);
                if (repo.files === undefined) throw new Error(`Repository with id ${this.current.repoId} has no files`);
                this.current.filesToCheck = repo.files.length;
                const filePathWorker = new Worker(filePathWorkerUrl);
                const filePaths = await promisifyWorker<{files: File[], downloadDir: string, seperator: string}, string[]>(filePathWorker, { files: repo.files, downloadDir: settingsStore.settings.downloadDirectoryPath ?? '', seperator: System.SEPERATOR });
                const hashes = await System.hashCheck(filePaths);
                const fileChangesWorker = new Worker(fileChangesWorkerUrl);
                const outDatedFiles = await promisifyWorker<{wantedFiles: File[], checkedFiles: Array<Array<string>>}, string[]>(fileChangesWorker, { wantedFiles: repo.files, checkedFiles: hashes[0] });
                this.cache.set(repo.id, { checkedFiles: hashes[0], outdatedFiles: outDatedFiles, missingFiles: hashes[1] as unknown as string[] });
                const modsets = repo?.modsets ? Array.from(repo?.modsets?.values()) : [];
                modsets.forEach(async modset => await repoStore.getModsetStatus(repo.id, modset.id));
                this.synchData();
                repoStore.saveRepoState();
                hashStore.synchData();
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
