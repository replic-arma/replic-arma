import { DownloadStatus } from '@/models/Download';
import { HashStatus, type Collection, type IReplicArmaRepository } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRouteStore } from '@/store/route';
import { launchCollection } from '@/util/system/game';
import { computedEager, type MaybeRef } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, isRef, ref, unref, watch } from 'vue';
import { useRepoStore } from '../store/repo';

export function useCollection(repoID: MaybeRef<string>, collectionID: MaybeRef<string>) {
    const repository = ref(null as null | IReplicArmaRepository);
    const collection = ref(null as null | Collection);
    const repoStore = useRepoStore();
    const downloadStore = useDownloadStore();
    const hashStore = useHashStore();
    const { reposInitialized } = storeToRefs(repoStore);
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
        const cacheData = hashStore.cache.find(cacheModset => cacheModset.id === unref(repoID));
        if (cacheData === undefined) return HashStatus.CHECKING;
        if (isDownloading.value) return DownloadStatus.DOWNLOADING;
        if (cacheData.outdated.length > 0 || cacheData.missing.length > 0) {
            return HashStatus.OUTDATED;
        } else {
            return HashStatus.READY;
        }
    });

    return {
        repository,
        collection,
        loading,
        loadingError,
        status,
        fetchModset: fetchAll,
        playCollection: play
    };
}
