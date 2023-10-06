import { useRepository } from '@/composables/useRepository';
import { RepositoryType, type IReplicArmaRepository, type Modset, type ModsetMod } from '@/models/Repository';
import { ERROR_CODE_INTERNAL, InternalError } from '@/util/Errors';
import { DEFAULT_LAUNCH_CONFIG } from '@/util/system/config';
import { loadModsetCache } from '@/util/system/modset_cache';
import { getRepoFromURL, loadRepos, saveRepos } from '@/util/system/repos';
import { ReplicWorker } from '@/util/worker';
import { notify } from '@kyvg/vue3-notification';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';
import { useHashStore } from './hash';
import { useSettingsStore } from './settings';

export const useRepoStore = defineStore('repo', () => {
    const repos = ref(null as null | Array<IReplicArmaRepository>);
    const modsetCache = ref([] as Array<Modset>);

    async function save() {
        if (repos.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_SAVE);
        return await saveRepos(repos.value);
    }

    async function addRepo(url: string) {
        const repo = await getRepoFromURL(url);
        let mods: ModsetMod[] = [];
        if (repo.files !== undefined) {
            mods = await ReplicWorker.createModsetFromFiles(repo.files);
        }
        repo.modsets.unshift({
            id: uuidv4(),
            name: 'All Mods',
            description: 'Contains all Mods from the Repository',
            mods
        });
        repo.modsets = repo.modsets.map((modset: Modset) => {
            return { ...modset, id: uuidv4(), mods: modset.mods.sort((a, b) => a.name.localeCompare(b.name)) };
        });
        const repoId = uuidv4();
        const repoC: IReplicArmaRepository = {
            ...repo,
            id: repoId,
            image: 'https://wiki.gruppe-adler.de/images/adlerkopp.png',
            type: RepositoryType.A3S,
            collections: [],
            launchOptions: useSettingsStore().settings?.launchOptions ?? DEFAULT_LAUNCH_CONFIG,
            downloadDirectoryPath: useSettingsStore().settings?.downloadDirectoryPath ?? ''
        };
        repos.value?.push(repoC as IReplicArmaRepository);
        notify({
            title: 'Added Repository',
            text: `Repository ${repoC.name} has been added`,
            type: 'success'
        });
        const { updateCache } = useRepository(repoId);
        await updateCache();
        await save();
        await useHashStore().addToQueue(repoC as IReplicArmaRepository);
    }

    loadRepos().then(async (reposdata: Array<IReplicArmaRepository>) => {
        repos.value = reposdata;
        for (const repo of reposdata) {
            const { updateRepository, checkRevisionChanged } = useRepository(repo.id);
            const cache = await loadModsetCache(repo.id);
            for (const modset of cache) {
                useRepoStore().modsetCache.push(modset);
            }
            const revisionChanged = await checkRevisionChanged();
            if (revisionChanged) {
                await updateRepository();
            }
            if (
                useSettingsStore().settings?.checkRepositoriesOnStartup === undefined ||
                useSettingsStore().settings?.checkRepositoriesOnStartup
            ) {
                useHashStore().addToQueue(repo);
            }
        }
    });

    function recalcRepositories() {
        if (repos.value === null) throw new InternalError(ERROR_CODE_INTERNAL.REPOSITORIES_NOT_LOADED_ACCESS);
        useHashStore().cache.clear();
        for (const repository of repos.value) {
            const { recalcRepository } = useRepository(repository.id);
            recalcRepository();
        }
    }

    return {
        addRepo,
        save,
        repos,
        modsetCache,
        recalcRepositories
    };
});
