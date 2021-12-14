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
        },
        getQueue: (state) => {
            return Array.from(state.queue.values());
        },
        getUpdateNeeded: (state) => {
            return Array.from(state.updateNeeded.values());
        }
    },
    actions: {
        addToQueue (download: DownloadItem) {
            this.queue.set(download.item.id, download);
        },
        startDownload (download: DownloadItem) {
            const activeDownloads = Array.from(this.downloads.values());
            activeDownloads.forEach((activeDownload: DownloadItem) => {
                activeDownload.status = 'paused';
                this.queue.set(activeDownload.item.id, activeDownload);
            });
            this.downloads.clear();
            this.queue.delete(download.item.id);
            download.status = 'inProgress';
            this.downloads.set(download.item.id, download);
        },
        stopDownload () {
            const activeDownloads = Array.from(this.downloads.values());
            activeDownloads.forEach((activeDownload: DownloadItem) => {
                activeDownload.status = 'paused';
                this.queue.set(activeDownload.item.id, activeDownload);
            });
            this.downloads.clear();
        },
        pauseDownload (download: DownloadItem) {
            download.status = 'paused';
        }
    }
});
