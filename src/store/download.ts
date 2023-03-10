import { useModset } from '@/composables/useModset';
import { DownloadStatus, type DownloadItem } from '@/models/Download';
import { RepositoryType, type IReplicArmaRepository, type Modset } from '@/models/Repository';
import { downloadFiles, DOWNLOAD_PROGRESS } from '@/util/system/download';
import type { HashResponseItem } from '@/util/system/hashes';
import { logDebug, logInfo, LogType } from '@/util/system/logger';
import { notify } from '@kyvg/vue3-notification';
import { sep } from '@tauri-apps/api/path';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useHashStore } from './hash';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
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
        const inQueue = queue.value.find(item => item.repoId === repoId);
        if (inQueue) return;
        const { updateSize } = useModset(repoId, modset.id);
        queue.value.push({
            item: modset,
            status: DownloadStatus.QUEUED,
            size: updateSize.value,
            received: 0,
            repoId
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
            logInfo(LogType.DOWNLOAD, `[${current.value.repoId}] ${current.value.item.name} Download started`);
            notify({
                title: 'Download started',
                text: `The download of Modset ${current.value.item?.name} has started`,
                type: 'success'
            });
            current.value.status = DownloadStatus.DOWNLOADING;
            const cacheData = useHashStore().cache.get(current.value?.item.id);
            if (cacheData === undefined) return;
            const repo = useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === current.value?.repoId);
            if (repo === undefined) throw new Error(`Repository with id ${current.value?.repoId} not found`);
            if (repo.download_server === undefined)
                throw new Error(`Repository with id ${current.value?.repoId} has no download server`);
            if (repo.downloadDirectoryPath === null) throw new Error('No download path set');
            const res = await downloadFiles(
                repo.type ?? RepositoryType.A3S,
                repo.download_server?.url,
                `${repo.downloadDirectoryPath}${sep}`,
                cacheData.missing.map((item: HashResponseItem) => item.file),
                cacheData.outdated.map((item: HashResponseItem) => item.file),
                useSettingsStore().settings?.maxConnections ?? 10
            );
            if (res !== DownloadStatus.PAUSED) {
                current.value.status = DownloadStatus.FINISHED;
                finished.value.push(current.value);
                logInfo(LogType.DOWNLOAD, `[${current.value.repoId}] ${current.value.item.name} Download finished`);
                notify({
                    title: 'Download finished',
                    text: `The download of Modset ${current.value.item?.name} has been completed`,
                    type: 'success'
                });
                current.value = null;
                await useRepoStore().recalcRepositories();
                next();
            }
        }
    }
    DOWNLOAD_PROGRESS.addEventListener('download_report', data => {
        if (current.value !== null) {
            current.value.received += data.detail.size;
            useDownloadStore().speeds.push(data.detail.size);
        }
    });

    const { cache } = storeToRefs(useHashStore());
    DOWNLOAD_PROGRESS.addEventListener('download_finished', data => {
        if (current.value !== null) {
            const cacheData = cache.value.get(current.value?.item.id);
            if (cacheData !== undefined) {
                cacheData.missing = cacheData.missing.filter(
                    (path: HashResponseItem) => path.file !== data.detail.path
                );
                cacheData.outdated = cacheData.outdated.filter(
                    (path: HashResponseItem) => path.file !== data.detail.path
                );
                logDebug(LogType.DOWNLOAD, `[${current.value.repoId}] ${data.detail.path}`);
            }
        }
    });

    return {
        current,
        queue,
        finished,
        next,
        addToDownloadQueue,
        speeds,
        stats
    };
});
