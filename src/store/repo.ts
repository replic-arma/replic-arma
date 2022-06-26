import type { Collection, GameServer, Modset, IReplicArmaRepository, ModsetMod, File } from '@/models/Repository';
import { saveModsetCache } from '@/util/system/modset_cache';
import { getRepoFromURL, loadRepos, saveRepos } from '@/util/system/repos';
import { ReplicWorker } from '@/util/worker';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ref, computed, toRaw } from 'vue';
import { useHashStore } from './hash';
import { useRouteStore } from './route';

export const useRepoStore = defineStore('repo', () => {
    const repos = ref(null as null | Array<IReplicArmaRepository>);
    const modsetCache = ref(null as null | Array<Modset>);

    const currentRepository = computed(() => {
        return repos.value?.find((repo: IReplicArmaRepository) => repo.id === useRouteStore().currentRepoID);
    });

    const currentModset = computed(() => {
        return repos.value
            ?.find((repo: IReplicArmaRepository) => repo.id === useRouteStore().currentRepoID)
            ?.modsets.find((modset: Modset) => modset.id === useRouteStore().currentModsetID);
    });

    const currentCollection = computed(() => {
        return repos.value
            ?.find((repo: IReplicArmaRepository) => repo.id === useRouteStore().currentRepoID)
            ?.collections.find((collection: Collection) => collection.id === useRouteStore().currentCollectionID);
    });

    function save() {
        if (repos.value === null) throw new Error('Repositories not loaded yet.');

        return saveRepos(repos.value);
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
            mods,
        });
        repo.modsets = repo.modsets.map((modset: Modset) => {
            return { ...modset, id: uuidv4() };
        });
        const repoId = uuidv4();
        repos.value?.push({
            ...repo,
            id: repoId,
            image: 'https://cdn.discordapp.com/channel-icons/834500277582299186/62046f86f4013c9a351b457edd4199b4.png?size=32',
            type: 'a3s',
            collections: [],
        });
        updateModsetCache(repoId);
        save();
        useHashStore().addToQueue(repo as IReplicArmaRepository);
    }

    async function addModset(repoID: string, options: Omit<Modset, 'id'>) {
        if (repos.value === null) throw new Error('Repositories not loaded yet.');

        const repo = repos.value.find((repo: IReplicArmaRepository) => repo.id === repoID);
        if (repo === undefined) throw new Error('Repository not found');

        const modset = { ...options, id: uuidv4() };
        repo.modsets?.push(modset);
    }

    async function addCollection(repoID: string, options: Omit<Collection, 'id'>) {
        if (repos.value === null) throw new Error('Repositories not loaded yet.');

        const repo = repos.value.find((repo: IReplicArmaRepository) => repo.id === repoID);
        if (repo === undefined) throw new Error('Repository not found');

        const collection = { ...options, id: uuidv4() };
        repo.collections?.push(collection);
    }

    async function addServer(repoID: string, options: Omit<GameServer, 'id'>) {
        if (repos.value === null) throw new Error('Repositories not loaded yet.');

        const repo = repos.value.find((repo: IReplicArmaRepository) => repo.id === repoID);
        if (repo === undefined) throw new Error('Repository not found');

        const server = { ...options, id: uuidv4() };
        repo.game_servers?.push(server);
    }

    async function checkRevision(repoID: string) {
        if (repos.value === null) throw new Error('Repositories not loaded yet.');

        const repo = repos.value.find((repo: IReplicArmaRepository) => repo.id === repoID);
        if (repo === undefined) throw new Error('Repository not found');
        if (repo.config_url === undefined) throw new Error('Repository has no autoconfig');
        const repoData = await getRepoFromURL(`${repo.config_url}autoconfig`);
        if (repoData.revision !== repo.revision) {
            console.log(`Update for Repo ${repoData.name} detected`);
            let mods: ModsetMod[] = [];
            if (repoData.files !== undefined) {
                mods = await ReplicWorker.createModsetFromFiles(repoData.files);
            }
            repo.modsets = repoData.modsets.map((modset: Modset) => {
                const oldModset = repo.modsets.find((oldModset) => oldModset.name === modset.name);
                return { ...modset, id: oldModset?.id ?? uuidv4() };
            });

            const allModsModset = repo.modsets.find((modset) => modset.name === 'All Mods');
            if (allModsModset !== undefined) {
                allModsModset.mods = mods;
                repo.modsets.unshift(allModsModset);
            }
            repos.value = useRepoStore().repos?.filter((repo: IReplicArmaRepository) => repo.id !== repo?.id) ?? [];
            repos.value?.push({
                ...repo,
                id: repo.id,
                image: 'https://cdn.discordapp.com/channel-icons/834500277582299186/62046f86f4013c9a351b457edd4199b4.png?size=32',
                type: 'a3s',
                revision: repoData.revision,
                collections: [],
            });
            updateModsetCache(repoID);
            save();
        }
    }

    async function updateModsetCache(repoID: string) {
        if (repos.value === null) throw new Error('Repositories not loaded yet.');
        const repo = repos.value.find((repo: IReplicArmaRepository) => repo.id === repoID);
        if (repo === undefined) throw new Error('Repository not found');
        const calculatedModsetCache = await ReplicWorker.mapFilesToMods(toRaw(repo.files), toRaw(repo.modsets));
        useRepoStore().modsetCache = [...calculatedModsetCache, ...(useRepoStore().modsetCache ?? [])];
        saveModsetCache(repo.id, calculatedModsetCache);
    }

    loadRepos().then((reposdata: Array<IReplicArmaRepository>) => {
        repos.value = reposdata;
        reposdata.forEach((repo: IReplicArmaRepository) => {
            checkRevision(repo.id);
            useHashStore().addToQueue(repo);
        });
    });

    return {
        currentRepository,
        currentModset,
        currentCollection,
        addModset,
        addRepo,
        addCollection,
        addServer,
        save,
        repos,
        modsetCache,
        checkRevision,
        updateModsetCache,
    };
});
