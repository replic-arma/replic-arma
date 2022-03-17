import { JSONMap, type IReplicArmaRepository, type File } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
import { toRaw } from 'vue';
import { ReplicWorker } from '@/util/worker';
export const useHashStore = defineStore('hash', {
    state: (): {
        current: null | { repoId: string; filesToCheck: number; checkedFiles: number };
        queue: { repoId: string; filesToCheck: number; checkedFiles: number }[];
        cache: JSONMap<string, { checkedFiles: string[][]; outdatedFiles: string[]; missingFiles: string[] }>;
    } => ({
        current: null,
        queue: [],
        cache: new JSONMap<string, { checkedFiles: string[][]; outdatedFiles: string[]; missingFiles: string[] }>(),
    }),
    getters: {
        getQueue: (state) => {
            return state.queue;
        },
    },
    actions: {
        async startHash(repo: IReplicArmaRepository) {
            console.info(`Repository ${repo.name} has been queued`);
            this.queue.push({ repoId: repo.id, filesToCheck: 1, checkedFiles: 1 });
            if (this.current === null) {
                this.next();
            }
        },
        async next() {
            this.current = null;
            if (this.queue.length > 0) {
                const firstElement = this.queue.splice(0, 1)[0];
                if (firstElement === undefined) throw new Error('Queue empty');
                this.current = firstElement;
                if (this.current === null) throw new Error('Current hash object empty');
                const hashStore = useHashStore();
                const settingsStore = useSettingsStore();
                const repoStore = useRepoStore();
                const repo = toRaw(repoStore.getRepo(this.current.repoId));
                if (repo === undefined) throw new Error(`Repository with id ${this.current.repoId} not found`);
                console.info(`Starting hash calc for repo ${repo.name}`);
                if (repo.files === undefined) throw new Error(`Repository with id ${this.current.repoId} has no files`);
                this.current.filesToCheck = repo.files.length;
                const hashes = await System.hashCheck(
                    `${settingsStore.settings.downloadDirectoryPath ?? ''}${System.SEPERATOR}`,
                    repo.files
                );
                if (hashes[0] === undefined) throw new Error('versteh ich alles nichtm ehr');
                const outDatedFiles = await ReplicWorker.getFileChanges(repo.files, hashes[0]);
                const modsets = repo?.modsets ? Array.from(repo?.modsets?.values()) : [];
                this.cache.set(repo.id, {
                    checkedFiles: hashes[0] as string[][],
                    outdatedFiles: outDatedFiles,
                    missingFiles: hashes[1] as unknown as string[],
                });
                const cached = toRaw(hashStore.cache.get(this.current.repoId));
                for (const modset of modsets) {
                    const modsetCache = toRaw(repoStore.modsetCache.get(modset.id));
                    if (cached?.checkedFiles === undefined || modsetCache === undefined)
                        throw new Error('cache empty!');
                    const modsetFiles = await ReplicWorker.getFilesForModset(modsetCache);
                    const outDatedFiles = await ReplicWorker.isFileIn(modsetFiles as File[], cached?.outdatedFiles);
                    const missingFiles = await ReplicWorker.isFileIn(modsetFiles as File[], cached?.missingFiles);
                    hashStore.cache.set(modset.id, {
                        checkedFiles: cached?.checkedFiles,
                        outdatedFiles: outDatedFiles,
                        missingFiles,
                    });
                }
                console.info(`Finished hash calc for repo ${repo.name}`);
                hashStore.next();
            }
        },
    },
});
