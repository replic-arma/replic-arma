import { useRepository } from '@/composables/useRepository';
import {
    RepositoryType,
    type File,
    type IReplicArmaRepository,
    type Modset,
    type ModsetMod
} from '@/models/Repository';
import { ERROR_CODE_INTERNAL, InternalError } from '@/util/Errors';
import { checkHashes, HASHING_PROGRESS, type HashResponse } from '@/util/system/hashes';
import { logDebug, logInfo, LogType, logWarn } from '@/util/system/logger';
import { ReplicWorker } from '@/util/worker';

import { defineStore } from 'pinia';
import { computed, reactive, ref, toRaw } from 'vue';
import { useRepoStore } from './repo';
import { useSettingsStore } from './settings';

export interface IHashItem {
    repoId: string;
    filesToCheck: number;
    checkedFiles: number;
}

export const useHashStore = defineStore('hash', () => {
    const current = ref(null as null | IHashItem);
    const queue = ref([] as Array<IHashItem>);
    const cache = reactive(new Map<string, HashResponse>());
    const alreadyCheckedCache = reactive(new Set<string>());
    async function addToQueue(repo: IReplicArmaRepository) {
        const inQueue = queue.value.find(item => item.repoId === repo.id);
        if (inQueue) return;
        logInfo(LogType.HASH, `Repository ${repo.name} has been queued`);
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
        if (settings === null) throw new InternalError(ERROR_CODE_INTERNAL.CONFIG_NOT_LOADED_ACCESS);
        if (currentHashRepo.value === undefined) throw new Error('Current hash repo not set (getHashes)');
        return await checkHashes(
            currentHashRepo.value.type ?? RepositoryType.A3S,
            `${currentHashRepo.value.downloadDirectoryPath ?? ''}\\`,
            currentHashRepo.value.files.map((file: File) => [file.path, file.sha1, file.size]),
            currentHashRepo.value.download_server?.url ?? ''
        );
    }

    async function next() {
        if (queue.value.length === 0) return;
        const firstElement = queue.value.splice(0, 1)[0];
        if (firstElement === undefined) throw new Error('Queue empty');
        current.value = firstElement;
        if (currentHashRepo.value === undefined) {
            logWarn(LogType.HASH, 'Current hash repo not set (next). It probably got deleted while in queue');
            return;
        }
        current.value.filesToCheck = currentHashRepo.value.files.length;
        window.performance.mark(current.value.repoId);
        logInfo(LogType.HASH, `Started hash calc for repo ${currentHashRepo.value.name}`);

        // Clear cache before hash check
        cache.delete(currentHashRepo.value.id);
        for (const modset of currentHashRepo.value.modsets) {
            cache.delete(modset.id);
        }

        const hashData = await getHashes();
        cache.set(currentHashRepo.value.id, hashData);
        const neededModsets = currentHashRepo.value.modsets.map((modset: Modset) => modset.id);
        let currentHashRepoModsetCache = useRepoStore().modsetCache?.filter((cacheModset: Modset) =>
            neededModsets.includes(cacheModset.id)
        );
        if (currentHashRepoModsetCache === undefined || currentHashRepoModsetCache.length === 0) {
            logDebug(LogType.HASH, `No Modset Cache for Repo ${currentHashRepo.value.name} found. Updating Cache.`);
            const { updateCache } = useRepository(currentHashRepo.value.id);
            await updateCache();
            currentHashRepoModsetCache = useRepoStore().modsetCache?.filter((cacheModset: Modset) =>
                neededModsets.includes(cacheModset.id)
            );
        }
        if (currentHashRepoModsetCache === undefined) throw new Error('cache empty after recalc!');
        for (const modset of currentHashRepo.value.modsets) {
            cache.delete(modset.id);
            const modsetCache = currentHashRepoModsetCache.find((cacheModset: Modset) => cacheModset.id === modset.id);
            if (hashData === undefined || modsetCache === undefined) throw new Error('cache empty!');
            const modsetFiles = toRaw(modsetCache).mods?.flatMap((mod: ModsetMod) => mod.files);
            const outdated = await ReplicWorker.isFileIn(modsetFiles as File[], hashData.outdated);
            const missing = await ReplicWorker.isFileIn(modsetFiles as File[], hashData.missing);
            const complete = await ReplicWorker.isFileIn(modsetFiles as File[], hashData.complete);
            const extra = await ReplicWorker.isFileIn(modsetFiles as File[], hashData.extra);

            cache.set(modset.id, {
                outdated,
                missing,
                extra,
                complete
            });
        }
        logInfo(
            LogType.HASH,
            `Finished hash calc for repo ${currentHashRepo.value.name} after ${
                window.performance.measure('repository', current.value.repoId).duration
            }`
        );
        current.value = null;
        alreadyCheckedCache.clear();
        next();
    }

    HASHING_PROGRESS.addEventListener('hash_calculated', e => {
        if (current.value !== null && !alreadyCheckedCache.has(e.detail.absolutePath)) {
            current.value.checkedFiles += 1;
            alreadyCheckedCache.add(e.detail.absolutePath);
            logDebug(
                LogType.HASH,
                `[${current.value.checkedFiles}/${current.value.filesToCheck}] [${current.value.repoId}] ${e.detail.absolutePath}`
            );
        }
    });

    HASHING_PROGRESS.addEventListener('hash_failed', e => {
        logDebug(LogType.HASH, `${e.detail.absolutePath}`);
    });

    HASHING_PROGRESS.addEventListener('zsync_completed', e => {
        if (current.value !== null && !alreadyCheckedCache.has(e.detail.filename)) {
            current.value.checkedFiles += 1;
            alreadyCheckedCache.add(e.detail.filename);
            logDebug(
                LogType.ZSYNC,
                `[${current.value.checkedFiles}/${current.value.filesToCheck}] [${current.value.repoId}] ${e.detail.filename}`
            );
        }
    });

    HASHING_PROGRESS.addEventListener('outdated_file_count', data => {
        if (current.value !== null) {
            current.value.checkedFiles = 0;
            current.value.filesToCheck = data.detail.count;
        }
    });

    return {
        addToQueue,
        current,
        cache,
        alreadyCheckedCache
    };
});
