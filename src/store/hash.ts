import type { IReplicArmaRepository, File, Modset, ModsetMod } from '@/models/Repository';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
import { computed, ref, toRaw } from 'vue';
import { ReplicWorker } from '@/util/worker';
import { checkHashes, HASHING_PROGRESS } from '@/util/system/hashes';
import { loadModsetCache } from '@/util/system/modset_cache';
export interface IHashItem {
    repoId: string;
    filesToCheck: number;
    checkedFiles: number;
}
export interface ICacheItem {
    id: string;
    checkedFiles: string[][];
    outdatedFiles: string[];
    missingFiles: string[];
}
export const useHashStore = defineStore('hash', () => {
    const current = ref(null as null | IHashItem);
    const queue = ref([] as Array<IHashItem>);
    const cache = ref([] as Array<ICacheItem>);
    async function addToQueue(repo: IReplicArmaRepository) {
        console.info(`Repository ${repo.name} has been queued`);
        queue.value.push({ repoId: repo.id, filesToCheck: 1, checkedFiles: 1 });
        if (current.value === null) {
            next();
        }
    }

    const currentHashRepo = computed(() => {
        return useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === current.value?.repoId);
    });

    async function getHashes() {
        const settings = useSettingsStore().settings;
        if (settings === null) throw Error('Settings null');
        if (currentHashRepo.value === undefined) throw new Error('Current hash repo not set (getHashes)');
        const reponse = await checkHashes(
            `${currentHashRepo.value.downloadDirectoryPath ?? ''}\\`,
            currentHashRepo.value.files.map((file: File) => file.path)
        );
        return {
            checkedFiles: (reponse[0] as string[][]) ?? [],
            missingFiles: (reponse[1] as unknown as string[]) ?? [],
        };
    }

    async function next() {
        if (queue.value.length > 0) {
            const firstElement = queue.value.splice(0, 1)[0];
            if (firstElement === undefined) throw new Error('Queue empty');
            current.value = firstElement;
            if (currentHashRepo.value === undefined) throw new Error('Current hash repo not set (next)');
            current.value.filesToCheck = currentHashRepo.value.files.length;
            const hashData = await getHashes();
            const wantedFiles = toRaw(currentHashRepo.value.files).filter(
                (file) => !hashData.missingFiles.includes(file.path)
            );
            const outDatedFiles = await ReplicWorker.getFileChanges(wantedFiles, hashData.checkedFiles);
            cache.value.push({
                id: currentHashRepo.value.id,
                checkedFiles: hashData.checkedFiles,
                outdatedFiles: outDatedFiles,
                missingFiles: hashData.missingFiles,
            });
            useRepoStore().modsetCache = [
                ...(await loadModsetCache(currentHashRepo.value.id)),
                ...(useRepoStore().modsetCache ?? []),
            ];
            const neededModsets = currentHashRepo.value.modsets.map((modset: Modset) => modset.id);
            let currentHashRepoModsetCache = toRaw(
                useRepoStore().modsetCache?.filter((cacheModset: Modset) => neededModsets.includes(cacheModset.id))
            );
            if (currentHashRepoModsetCache === undefined || currentHashRepoModsetCache.length === 0) {
                console.log(`No Modset Cache for Repo ${currentHashRepo.value.name} found. Updating Cache.`);
                await useRepoStore().updateModsetCache(currentHashRepo.value.id);
                currentHashRepoModsetCache = toRaw(
                    useRepoStore().modsetCache?.filter((cacheModset: Modset) => neededModsets.includes(cacheModset.id))
                );
            }
            if (currentHashRepoModsetCache === undefined) throw new Error('cache empty after recalc!');
            const cached = toRaw(cache.value.find((cacheValue) => cacheValue.id === currentHashRepo.value?.id));
            for (const modset of currentHashRepo.value.modsets) {
                const modsetCache = toRaw(
                    currentHashRepoModsetCache.find((cacheModset: Modset) => cacheModset.id === modset.id)
                );
                if (cached?.checkedFiles === undefined || modsetCache === undefined) throw new Error('cache empty!');
                const modsetFiles = modsetCache.mods?.flatMap((mod: ModsetMod) => mod.files);
                const outDatedFiles = await ReplicWorker.isFileIn(modsetFiles as File[], cached?.outdatedFiles);
                const missingFiles = await ReplicWorker.isFileIn(modsetFiles as File[], cached?.missingFiles);
                cache.value.push({
                    id: modset.id,
                    checkedFiles: cached?.checkedFiles,
                    outdatedFiles: outDatedFiles,
                    missingFiles,
                });
            }
            console.info(`Finished hash calc for repo ${currentHashRepo.value.name}`);
            current.value = null;
            next();
        }
    }

    HASHING_PROGRESS.addEventListener('hash_calculated', () => {
        const current = useHashStore().current;
        if (current !== null) {
            current.checkedFiles += 1;
        }
    });

    return {
        addToQueue,
        current,
        cache,
    };
});
