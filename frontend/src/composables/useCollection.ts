import { DownloadStatus } from '@/models/Download';
import { HashStatus, type Collection, type IReplicArmaRepository } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { resolveModNameFromPath } from '@/util/format';
import { launchCollection } from '@/util/system/game';
import type { HashResponseItem } from '@/util/system/hashes';
import { computedEager, type MaybeRef } from '@vueuse/core';
import { computed, isRef, ref, unref, watch } from 'vue';

export function useCollection(repoID: MaybeRef<string>, collectionID: MaybeRef<string>) {
    const repository = ref(null as null | IReplicArmaRepository);
    const collection = ref(null as null | Collection);
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
        return downloadStore.current !== null && downloadStore.current?.item.id === unref(collectionID);
    });
    async function fetchRepository() {
        loadingError.value = null;

        try {
            repository.value =
                repoStore.repos!.find((repo: IReplicArmaRepository) => repo.id === unref(repoID)) ?? null;
            if (repository.value === null) return;
            collection.value =
                repository.value?.collections.find(
                    (collection: Collection) => collection.id === useRouteStore().currentCollectionID
                ) ?? null;
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
    if (isRef(collectionID)) watch(collectionID, fetchAll);

    async function play() {
        if (collection.value === null) return;
        launchCollection(collection.value, unref(repoID));
    }

    const status = computed(() => {
        const cacheData = hashStore.cache.get(unref(repoID));
        if (cacheData === undefined) return HashStatus.CHECKING;
        if (isDownloading.value) return DownloadStatus.DOWNLOADING;
        if (cacheData.outdated.length > 0 || cacheData.missing.length > 0) {
            return HashStatus.OUTDATED;
        } else {
            return HashStatus.READY;
        }
    });

    const size = computed(() => {
        if (modsetCache === null || repository.value === null || collection.value?.modsets === undefined) return 0;
        const modNames = Object.values(collection.value?.modsets).flat();
        return repository.value?.files
            .filter(file => modNames.includes(resolveModNameFromPath(file.path)))
            .reduce((previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size, 0);
    });

    const updateSize = computed(() => {
        const cacheData = hashStore.cache.get(unref(repoID));
        const missingSize = (cacheData?.missing ?? [])
            .map((item: HashResponseItem) => item.size)
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
        const outdatedSize = (cacheData?.outdated ?? [])
            .map((item: HashResponseItem) => item.current_size)
            .reduce((previousValue: number, currentValue: number) => previousValue + currentValue, 0);
        return Number(missingSize + outdatedSize);
    });

    return {
        repository,
        collection,
        loading,
        loadingError,
        status,
        updateSize,
        size,
        fetchModset: fetchAll,
        playCollection: play
    };
}
