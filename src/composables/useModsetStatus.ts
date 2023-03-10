import { DownloadStatus } from '@/models/Download';
import { HashStatus } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore, type IHashItem } from '@/store/hash';
import { computedEager, computedWithControl, type MaybeRef } from '@vueuse/core';
import { computed, unref } from 'vue';

export function useModsetStatus(repoID: MaybeRef<string>, modsetID: MaybeRef<string>) {
    const downloadStore = useDownloadStore();
    const hashStore = useHashStore();

    const isDownloading = computedEager(() => {
        return downloadStore.current !== null && downloadStore.current?.item.id === unref(modsetID);
    });
    const isChecking = computedEager(() => {
        return hashStore.current !== null && hashStore.current?.repoId === unref(repoID);
    });

    const status = computedWithControl(
        () => hashStore.cache,
        () => {
            const cacheData = hashStore.cache.get(unref(modsetID));
            if (cacheData === undefined || isChecking.value) return HashStatus.CHECKING;
            if (isDownloading.value) return DownloadStatus.DOWNLOADING;
            if (cacheData.outdated.length > 0 || cacheData.missing.length > 0) {
                return HashStatus.OUTDATED;
            } else {
                return HashStatus.READY;
            }
        }
    );

    const progress = computed(() => {
        if (isDownloading.value) {
            return +Number(
                (downloadStore.current!.received / 10e5 / (downloadStore.current!.size / 10e8)) * 100
            ).toFixed(0);
        } else {
            // if (isChecking.value) return 0;
            if (hashStore.current === null || hashStore.current!.repoId !== unref(repoID)) return 0;
            const { checkedFiles, filesToCheck } = hashStore.current as IHashItem;
            return Math.floor((checkedFiles / filesToCheck) * 100);
        }
    });

    return {
        status,
        progress
    };
}
