import type { IReplicArmaRepository, File, Modset, ModsetMod } from '@/models/Repository';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';
import { computed, ref, toRaw } from 'vue';
import { ReplicWorker } from '@/util/worker';
import { checkHashes } from '@/util/system/hashes';
import { loadModsetCache } from '@/util/system/modset_cache';
export interface IHashItem {
    repoId: string;
    filesToCheck: number;
    checkedFiles: number;
}

export const useHashStore = defineStore('hash', () => {
    const current = ref(null as null | IHashItem);
    const queue = ref([] as Array<IHashItem>);
    const cache = ref(
        [] as Array<{ id: string; checkedFiles: string[][]; outdatedFiles: string[]; missingFiles: string[] }>
    );
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
        if (currentHashRepo.value === undefined) throw new Error('Queue empty');
        const reponse = await checkHashes(
            `${settings.downloadDirectoryPath ?? ''}\\`,
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
            if (currentHashRepo.value === undefined) throw new Error('Queue empty');
            current.value.filesToCheck = currentHashRepo.value.files.length;
            const hashData = await getHashes();
            const outDatedFiles = await ReplicWorker.getFileChanges(
                toRaw(currentHashRepo.value.files),
                hashData.checkedFiles
            );
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
            const cached = toRaw(cache.value.find((cacheValue) => cacheValue.id === currentHashRepo.value?.id));
            for (const modset of currentHashRepo.value.modsets) {
                const modsetCache = toRaw(
                    useRepoStore().modsetCache?.find((cacheModset: Modset) => cacheModset.id === modset.id)
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
            next();
        }
    }

    return {
        addToQueue,
        current,
        cache,
    };
});
