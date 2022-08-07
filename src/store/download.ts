import type { DownloadItem } from '@/models/Download';
import type { IReplicArmaRepository, Modset } from '@/models/Repository';
import { downloadFiles, DOWNLOAD_PROGRESS } from '@/util/system/download';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useHashStore } from './hash';
import { useRepoStore } from './repo';
import { sep } from '@tauri-apps/api/path';
import { notify } from '@kyvg/vue3-notification';
import type { HashResponseItem } from '@/util/system/hashes';
export const useDownloadStore = defineStore('download', () => {
    const current = ref(null as null | DownloadItem);
    const queue = ref([] as Array<DownloadItem>);
    const finished = ref([] as Array<DownloadItem>);
    const speeds = ref([] as Array<number>);
    const stats = ref(
        null as null | {
            avg: number;
            max: number;
            cur: number;
        }
    );

    async function addToDownloadQueue(modset: Modset, repoId: string) {
        const cacheData = useHashStore().cache.find((cacheItem) => cacheItem.id === modset.id);
        if (cacheData === undefined) return;
        const filesToDownload = [...cacheData.missing, ...cacheData.outdated];
        const totalSize = filesToDownload
            .map((item: HashResponseItem) => item.size)
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
        queue.value.push({
            item: modset,
            status: 'queued',
            size: totalSize,
            received: 0,
            repoId,
        });
        if (current.value === null) {
            next();
        }
    }

    async function next() {
        if (queue.value.length > 0 && current.value === null) {
            const downloadItem = queue.value[0];
            if (downloadItem === undefined) return;
            current.value = downloadItem;
            queue.value = queue.value.filter(
                (queueDownloadItem: DownloadItem) => queueDownloadItem.item.id !== downloadItem.item.id
            );
        }
        if (current.value !== null) {
            notify({
                title: 'Download started',
                text: `The download of Modset ${current.value.item?.name} has started`,
                type: 'success',
            });
            current.value.status = 'downloading';
            const cacheData = useHashStore().cache.find((cacheItem) => cacheItem.id === current.value?.item.id);
            if (cacheData === undefined) return;
            const filesToDownload = [...cacheData.missing, ...cacheData.outdated];
            const repo = useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === current.value?.repoId);
            if (repo === undefined) throw new Error(`Repository with id ${current.value?.repoId} not found`);
            if (repo.download_server === undefined)
                throw new Error(`Repository with id ${current.value?.repoId} has no download server`);
            if (repo.downloadDirectoryPath === null) throw new Error('No download path set');
            const res = await downloadFiles(
                repo.type ?? 'A3S',
                repo.download_server?.url,
                `${repo.downloadDirectoryPath}${sep}`,
                filesToDownload.map((item: HashResponseItem) => item.file)
            );
            if (res !== 'paused') {
                finished.value.push(current.value);
                notify({
                    title: 'Download finished',
                    text: `The download of Modset ${current.value.item?.name} has been completed`,
                    type: 'success',
                });
                current.value = null;
                await useRepoStore().recalcRepositories();
                next();
            }
        }
    }

    DOWNLOAD_PROGRESS.addEventListener('download_report', (data) => {
        const current = useDownloadStore().current;
        if (current !== null) {
            current.received += data.detail.size;
            useDownloadStore().speeds.push(data.detail.size);
        }
    });

    DOWNLOAD_PROGRESS.addEventListener('download_finished', (data) => {
        const { current } = storeToRefs(useDownloadStore());
        const { cache } = storeToRefs(useHashStore());
        if (current.value !== null) {
            const cacheData = cache.value.find((cacheItem) => cacheItem.id === current.value?.item.id);
            if (cacheData !== undefined) {
                cacheData.missing = cacheData.missing.filter(
                    (path: HashResponseItem) => path.file !== data.detail.path
                );
                cacheData.outdated = cacheData.outdated.filter(
                    (path: HashResponseItem) => path.file !== data.detail.path
                );
            }
        }
    });

    return {
        current,
        queue,
        next,
        addToDownloadQueue,
        speeds,
        stats,
    };
});
