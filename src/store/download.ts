import { DownloadItem } from '@/models/Download';
import { defineStore } from 'pinia';

export const useDownloadStore = defineStore('download', {
    state: (): {downloads: DownloadItem[]} => ({
        downloads: []
    }),
    getters: {
        getDownloads: (state) => {
            return state.downloads;
        }
    },
    actions: {
        addDownload (download: DownloadItem) {
            this.downloads.push(download);
        },
        removeDownload (index: number) {
            this.downloads.splice(index, 1);
        }
    }
});
