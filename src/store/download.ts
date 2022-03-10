import { DownloadItem } from '@/models/Download';
import { Modset } from '@/models/Repository';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useDownloadStore = defineStore('download', {
    state: (): {queue: Map<string, DownloadItem>} => ({
        queue: new Map<string, DownloadItem>()
    }),
    getters: {},
    actions: {
        addToDownloadQueue (modset: Modset) {
            this.queue.set(uuidv4(), { item: modset, status: 'paused', size: 0, done: 0 });
        }
    }
});
