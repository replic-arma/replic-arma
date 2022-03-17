import type { DownloadItem } from '@/models/Download';
import type { Modset } from '@/models/Repository';
import { System } from '@/util/system';
import { ReplicWorker } from '@/util/worker';
import { defineStore } from 'pinia';
import { toRaw } from 'vue';
import { useHashStore } from './hash';
import { useRepoStore } from './repo';

export const useDownloadStore = defineStore('download', {
    state: (): {
        current: null | DownloadItem;
        queue: Map<string, DownloadItem>;
        finished: Map<string, DownloadItem>;
        speeds: number[];
        stats: null | { avg: number; cur: number; max: number };
    } => ({
        current: null,
        queue: new Map<string, DownloadItem>(),
        finished: new Map<string, DownloadItem>(),
        speeds: [],
        stats: null,
    }),
    getters: {},
    actions: {
        async addToDownloadQueue(modset: Modset, repoId: string) {
            const hashStore = useHashStore();
            const repoStore = useRepoStore();
            const modsetCacheData = repoStore.modsetCache.get(modset.id);
            const cacheData = hashStore.cache.get(modset.id);
            if (cacheData === undefined) return;
            const filesToDownload = [...cacheData.missingFiles, ...cacheData.outdatedFiles];
            const totalSize = await ReplicWorker.getFileSize(toRaw(modsetCacheData?.mods) ?? [], filesToDownload);
            this.queue.set(modset.id, {
                item: modset,
                status: 'paused',
                size: totalSize,
                received: 0,
                repoId,
            });
            if (this.current === null) {
                this.next();
            }
        },
        async next() {
            const hashStore = useHashStore();
            if (this.queue.size > 0 && this.current === null) {
                const index = Array.from(this.queue.keys())[0];
                if (index === undefined) return;
                this.current = this.queue.get(index) as DownloadItem;
                this.queue.delete(index);
                const cacheData = hashStore.cache.get(this.current.item.id);
                if (cacheData === undefined) return;
                const fliesToDownload = [...cacheData.missingFiles, ...cacheData.outdatedFiles];
                this.current.status = 'downloading';
                System.downloadFiles(this.current.repoId, this.current.item.id, fliesToDownload);
            } else if (this.current !== null) {
                this.current.status = 'downloading';
                const cacheData = hashStore.cache.get(this.current.item.id);
                if (cacheData === undefined) return;
                const fliesToDownload = [...cacheData.missingFiles, ...cacheData.outdatedFiles];
                await System.downloadFiles(this.current.repoId, this.current.item.id, fliesToDownload);
                this.finished.set(this.current.item.id, this.current);
            }
        },
    },
});
