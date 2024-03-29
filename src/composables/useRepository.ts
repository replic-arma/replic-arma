import { isReplicArmaError } from '@/models/Error';
import type { Collection, GameServer, IReplicArmaRepository, Modset, ModsetMod, Repository } from '@/models/Repository';
import { RepositoryType } from '@/models/Repository';
import type { GameLaunchSettings } from '@/models/Settings';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { ERROR_CODE_INTERNAL, InternalError } from '@/util/Errors';
import { clearModsetCache, saveModsetCache } from '@/util/system/modset_cache';
import { getRepoFromURL } from '@/util/system/repos';
import { ReplicWorker } from '@/util/worker';
import { notify } from '@kyvg/vue3-notification';
import { computedEager, type MaybeRef } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { isRef, ref, toRaw, unref, watch } from 'vue';

export function useRepository(repoID: MaybeRef<string>) {
    const repository = ref(null as null | IReplicArmaRepository);
    const reposInitialized = computedEager(() => {
        return useRepoStore().repos !== null;
    });
    const loading = ref(true);
    const loadingError = ref(null as unknown);
    async function fetchRepository() {
        loadingError.value = null;

        try {
            repository.value =
                useRepoStore().repos!.find((repo: IReplicArmaRepository) => repo.id === unref(repoID)) ?? null;
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

    async function addModset(options: Omit<Modset, 'id'>) {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        const modset = { ...options, id: uuidv4() };
        repository.value.modsets?.push(modset);
        await useRepoStore().save();
        notify({
            title: 'Added Modset',
            text: `Added new Modset ${modset.name}`,
            type: 'success'
        });
    }

    async function addCollection(options: Omit<Collection, 'id'>) {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        const collection = { ...options, id: uuidv4() };
        repository.value.collections?.push(collection);
        await useRepoStore().save();
        notify({
            title: 'Added Collection',
            text: `Added new Collection ${collection.name}`,
            type: 'success'
        });
    }

    async function addServer(options: Omit<GameServer, 'id'>) {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        const server = { ...options, id: uuidv4() };
        repository.value.game_servers?.push(server);
        await useRepoStore().save();
        notify({
            title: 'Added Server',
            text: `Added new Server ${server.name}`,
            type: 'success'
        });
    }
    async function checkRevisionChanged() {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        if (repository.value?.type === RepositoryType.A3S) {
            if (repository.value.config_url === undefined) throw new Error('Repository has no autoconfig');
            const repoData = await getRepoFromURL(`${repository.value.config_url}autoconfig`);
            if (repoData.revision !== repository.value.revision) {
                console.debug(
                    `Update for Repository ${repository.value.name} detected. Old revision ${repository.value.revision} new revision ${repoData.revision}`
                );
            }
            return repoData.revision !== repository.value.revision;
        }
        return false;
    }
    async function updateRepository() {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        if (repository.value.config_url === undefined) throw new Error('Repository has no autoconfig');
        const repoData = await getRepoFromURL(`${repository.value.config_url}autoconfig`);
        console.debug(`Updating Repository ${repoData.name}`);
        await clearModsetCache(unref(repoID));
        await updateModsets(repoData);
        await updateCollections();
        await updateModsetCache();
        repository.value.build_date = repoData.build_date;
        repository.value.revision = repoData.revision;
        await useRepoStore().save();
        console.debug(`Updating Repository ${repoData.name} finished`);
    }

    async function updateModsets(repoData: Repository) {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        let mods: ModsetMod[] = [];
        if (repoData.files === undefined) return; // TODO handle this later
        repository.value.files = repoData.files;

        mods = await ReplicWorker.createModsetFromFiles(repoData.files);
        const allModsModset = repository.value.modsets.find(modset => modset.name === 'All Mods');
        repository.value.modsets = repoData.modsets.map((modset: Modset) => {
            const oldModset = repository.value!.modsets.find(
                oldModset => oldModset.name === modset.name && oldModset.name !== 'All Mods'
            );
            return { ...modset, id: oldModset?.id ?? uuidv4() };
        });

        if (allModsModset !== undefined) {
            allModsModset.mods = mods;
            repository.value.modsets.unshift(allModsModset);
        } else {
            repository.value.modsets.unshift({
                id: uuidv4(),
                name: 'All Mods',
                description: 'Contains all Mods from the Repository',
                mods
            });
        }
    }

    async function updateCollections() {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        const modSetIds = repository.value.modsets.map((modset: Modset) => modset.id);
        repository.value.collections = repository.value.collections.map((collection: Collection) => {
            if (collection.modsets !== undefined) {
                Object.keys(collection.modsets).forEach((mId: string) => {
                    if (!modSetIds.includes(mId)) {
                        delete collection.modsets[mId];
                    } else {
                        const modset = repository.value!.modsets.find((modset: Modset) => modset.id === mId);
                        if (modset === undefined) throw new Error('Could not find modset in collection update');
                        const modNames = modset.mods.map((mod: ModsetMod) => mod.name);
                        if (collection.modsets[mId] === undefined)
                            throw new Error('Could not find modset in collection update');
                        collection.modsets[mId]!.filter((modName: string) => modNames?.includes(modName));
                    }
                });
            }
            return collection;
        });
    }

    async function recalc() {
        try {
            if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
            notify({
                title: 'Reloading Repository',
                text: 'Checking for Updates and recalculating the status',
                type: 'success'
            });
            const revisionChanged = await checkRevisionChanged();
            if (revisionChanged) {
                await updateRepository();
            }
            useHashStore().addToQueue(repository.value);
        } catch (err) {
            if (isReplicArmaError(err)) {
                notify({
                    title: 'Failed to reload Repository',
                    text: err.description,
                    type: 'error'
                });
            }
        }
    }

    async function updateModsetCache() {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        const calculatedModsetCache = await ReplicWorker.mapFilesToMods(
            toRaw(repository.value.files),
            toRaw(repository.value.modsets)
        );
        const modsetIds = calculatedModsetCache.map((modset: Modset) => modset.id);
        useRepoStore().modsetCache = useRepoStore().modsetCache.filter(modsetCache =>
            !modsetIds.includes(modsetCache.id)
        );
        useRepoStore().modsetCache = [...calculatedModsetCache, ...(useRepoStore().modsetCache ?? [])];
        await saveModsetCache(unref(repoID), calculatedModsetCache);
    }

    async function removeCollection(collectionId: string) {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        repository.value.collections = repository.value.collections?.filter(
            collection => collection.id !== collectionId
        );
        await useRepoStore().save();
    }

    async function updateLaunchOptions(launchOptions: GameLaunchSettings) {
        if (repository.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        repository.value.launchOptions = launchOptions;
        await useRepoStore().save();
    }

    return {
        repository,
        loading,
        loadingError,
        fetchRepository: fetchAll,
        recalcRepository: recalc,
        updateRepository,
        updateCache: updateModsetCache,
        addModset,
        addCollection,
        addServer,
        checkRevisionChanged,
        removeCollection,
        updateLaunchOptions
    };
}
