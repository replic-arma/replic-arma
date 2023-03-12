import type { IReplicArmaRepository, Modset, ModsetMod } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { launchModset } from '@/util/system/game';
import type { HashResponseItem } from '@/util/system/hashes';
import { notify } from '@kyvg/vue3-notification';
import { computedEager, type MaybeRef } from '@vueuse/core';
import { computed, isRef, ref, unref, watch } from 'vue';
import { useModsetStatus } from './useModsetStatus';

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

    const { progress, status } = useModsetStatus(unref(repoID), unref(modsetID));

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
        return files.value.reduce(
            (previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size,
            0
        );
    });

    async function play() {
        if (modset.value === undefined || modset.value === null) return;
        launchModset(modset.value.id, useRouteStore().currentRepoID ?? '');
    }

    const updateSize = computed(() => {
        const cacheData = hashStore.cache.get(modset.value!.id);
        const missingSize = (cacheData?.missing ?? [])
            .map((item: HashResponseItem) => item.size)
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
        const outdatedSize = (cacheData?.outdated ?? [])
            .map((item: HashResponseItem) => item.current_size)
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
        return Number(missingSize + outdatedSize);
    });

    const updateFiles = computed(() => {
        const cacheData = hashStore.cache.get(modset.value!.id);
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
