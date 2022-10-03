import { DownloadStatus } from '@/models/Download';
import { HashStatus, type IReplicArmaRepository, type Modset, type ModsetMod } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore, type IHashItem } from '@/store/hash';
import { useRouteStore } from '@/store/route';
import { launchModset } from '@/util/system/game';
import type { HashResponseItem } from '@/util/system/hashes';
import { notify } from '@kyvg/vue3-notification';
import { computedEager, type MaybeRef } from '@vueuse/core';
import { computed, isRef, ref, unref, watch } from 'vue';
import { useRepoStore } from '../store/repo';

export function useModset(repoID: MaybeRef<string>, modsetID: MaybeRef<string>) {
    const repository = ref(null as null | IReplicArmaRepository);
    const modset = ref(null as null | Modset);
    const repoStore = useRepoStore();
    const downloadStore = useDownloadStore();
    const hashStore = useHashStore();
    const modsetCache = repoStore.modsetCache;
    const reposInitialized = computedEager(() => {
        return repoStore.repos !== null;
    });
    const loading = ref(true);
    const loadingError = ref(null as unknown);
    const isDownloading = computedEager(() => {
        return downloadStore.current !== null && downloadStore.current?.item.id === unref(modsetID);
    });
    const isChecking = computedEager(() => {
        return hashStore.current !== null && hashStore.current?.repoId === unref(repoID);
    });
    async function fetchRepository() {
        loadingError.value = null;

        try {
            repository.value =
                repoStore.repos!.find((repo: IReplicArmaRepository) => repo.id === unref(repoID)) ?? null;
            if (repository.value === null) return;
            modset.value = repository.value?.modsets.find((modset: Modset) => modset.id === unref(modsetID)) ?? null;
        } catch (err) {
            loadingError.value = err;
        }
    }

    function fetchAll() {
        if (!reposInitialized) return;
        loading.value = true;
        fetchRepository().then(() => {
            loading.value = false;
        });
    }
    fetchAll();
    if (isRef(reposInitialized)) watch(reposInitialized, fetchAll);
    if (isRef(repoID)) watch(repoID, fetchAll);
    if (isRef(modsetID)) watch(modsetID, fetchAll);

    const status = computed(() => {
        const cacheData = hashStore.cache.find(cacheModset => cacheModset.id === modset.value!.id);
        if (cacheData === undefined || isChecking.value) return HashStatus.CHECKING;
        if (isDownloading.value) return DownloadStatus.DOWNLOADING;
        if (cacheData.outdated.length > 0 || cacheData.missing.length > 0) {
            return HashStatus.OUTDATED;
        } else {
            return HashStatus.READY;
        }
    });

    const progress = computed(() => {
        if (isDownloading.value) {
            return Number(
                (downloadStore.current!.received / 10e5 / (downloadStore.current!.size / 10e8)) * 100
            ).toFixed(0);
        } else {
            if (isChecking.value) return 0;
            if (hashStore.current === null) return 0;
            const { checkedFiles, filesToCheck } = hashStore.current as IHashItem;
            return Math.floor((checkedFiles / filesToCheck) * 100);
        }
    });

    async function download() {
        if (modset.value === undefined || modset.value === null) return;
        downloadStore.addToDownloadQueue(modset.value, useRouteStore().currentRepoID ?? '');
        notify({
            title: 'Added Modset to queue',
            text: `Modset ${modset.value.name} has been added to the download queue`,
            type: 'success'
        });
    }

    const files = computed(() => {
        if (modsetCache === null || modset.value === undefined) return [];
        const cacheData = modsetCache.find(cacheModset => cacheModset.id === modset.value!.id);
        return cacheData?.mods.flatMap((mod: ModsetMod) => mod.files ?? []) ?? [];
    });

    const size = computed(() => {
        if (modsetCache === null || modset.value === undefined) return 0;
        return Number(
            files.value.reduce(
                (previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size,
                0
            ) / 10e8
        ).toFixed(2);
    });

    async function play() {
        if (modset.value === undefined || modset.value === null) return;
        launchModset(modset.value.id, useRouteStore().currentRepoID ?? '');
    }

    const updateSize = computed(() => {
        const cacheData = hashStore.cache.find(cacheModset => cacheModset.id === modset.value!.id);
        const mods = [...(cacheData?.outdated ?? []), ...(cacheData?.missing ?? [])];
        return Number(
            mods
                .map((item: HashResponseItem) => item.size)
                .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0) / 10e8
        ).toFixed(2);
    });

    const updateFiles = computed(() => {
        const cacheData = hashStore.cache.find(cacheModset => cacheModset.id === modset.value!.id);
        if (cacheData === null) return [];

        const filesToDownload = [...(cacheData?.missing ?? []), ...(cacheData?.outdated ?? [])];

        return filesToDownload.map((item: HashResponseItem) => item.file);
    });

    return {
        repository,
        modset,
        loading,
        loadingError,
        status,
        progress,
        updateSize,
        updateFiles,
        size,
        files,
        fetchModset: fetchAll,
        downloadModset: download,
        playModset: play
    };
}
