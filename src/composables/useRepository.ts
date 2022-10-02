import type { IReplicArmaRepository } from '@/models/Repository';
import { useHashStore, type ICacheItem } from '@/store/hash';
import { notify } from '@kyvg/vue3-notification';
import type { MaybeRef } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { isRef, ref, unref, watch } from 'vue';
import { useRepoStore } from '../store/repo';

export function useRepository(repoID: MaybeRef<string>) {
    const repository = ref(null as null | IReplicArmaRepository);
    const repoStore = useRepoStore();
    const { reposInitialized } = storeToRefs(repoStore);
    const loading = ref(true);
    const loadingError = ref(null as unknown);
    async function fetchRepository() {
        loadingError.value = null;

        try {
            repository.value =
                repoStore.repos!.find((repo: IReplicArmaRepository) => repo.id === unref(repoID)) ?? null;
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

    async function recalc() {
        if (repository.value === null) throw new Error('No Repository found');
        useHashStore().cache = useHashStore().cache.filter((cacheItem: ICacheItem) => cacheItem.id !== unref(repoID));
        await useRepoStore().checkRevision(repository.value.id);
        await useHashStore().addToQueue(repository.value);
        notify({
            title: 'Reloading Repository',
            text: 'Checking for Updates and recalculating the status',
            type: 'success'
        });
    }

    return {
        repository,
        loading,
        loadingError,
        fetchRepository: fetchAll,
        recalcRepository: recalc
    };
}
