import { DownloadItem } from '@/models/Download';
import { Modset } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { toRaw } from 'vue';
import { useHashStore } from './hash';
import { useRepoStore } from './repo';

export const useDownloadStore = defineStore('download', {
    state: (): {
        current: null | DownloadItem;
        queue: Map<string, DownloadItem>;
        speeds: number[],
        stats: null|{avg: number, cur:number, max: number}
    } => ({
        current: null,
        queue: new Map<string, DownloadItem>(),
        speeds: [],
        stats: null
    }),
    getters: {},
    actions: {
        addToDownloadQueue (modset: Modset, repoId: string) {
            this.queue.set(uuidv4(), {
                item: modset,
                status: 'paused',
                size: 0,
                done: 0,
                repoId: repoId
            });
            if (this.current === null) {
                this.next();
            }
        },
        async next () {
            if (this.queue.size > 0) {
                const index = Array.from(this.queue.keys())[0];
                this.current = this.queue.get(index) as DownloadItem;
                this.queue.delete(index);
                const hashStore = useHashStore();
                const repoStore = useRepoStore();
                const cacheData = hashStore.cache.get(this.current.item.id);
                if (cacheData === undefined) return;
                const modsetCacheData = repoStore.modsetCache.get(this.current.item.id);
                const fliesToDownload = [...cacheData.missingFiles, ...cacheData.outdatedFiles];
                this.current.size = await (await hashStore.getWorker).getFileSize(toRaw(modsetCacheData?.mods), fliesToDownload);
                this.current.status = 'downloading';
                System.downloadFiles(this.current.repoId, this.current.item.id, fliesToDownload);
            }
        }
    }
});
