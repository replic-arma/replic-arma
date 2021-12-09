import { DownloadItem } from '@/models/Download';
import { defineStore } from 'pinia';

export const useDownloadStore = defineStore('download', {
    state: (): {downloads: Map<string, DownloadItem>, queue: Map<string, DownloadItem>, updateNeeded: Map<string, DownloadItem>} => ({
        downloads: new Map<string, DownloadItem>(),
        queue: new Map<string, DownloadItem>(),
        updateNeeded: new Map<string, DownloadItem>()
    }),
    getters: {
        getDownloads: (state) => {
            return Array.from(state.downloads.values());
        }
    },
    actions: {
        addDownload (download: DownloadItem) {
            this.downloads.set(download.item.id, download);
        },
        removeDownload (id: string) {
            this.downloads.delete(id);
        }
    }
});
