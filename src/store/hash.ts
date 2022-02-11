import { Modset } from '@/models/Repository';
import { System } from '@/util/system';
import { defineStore } from 'pinia';
import { useRepoStore } from './repo';

export const useHashStore = defineStore('hash', {
    state: (): {current: null|{ repoId: string; modsetId: string; filesToCheck: number; checkedFiles: number; }, queue: { repoId: string; modsetId: string; filesToCheck: number; checkedFiles: number; }[]} => ({
        current: null,
        queue: []
    }),
    getters: {
        getQueue: (state) => {
            return state.queue;
        }
    },
    actions: {
        startHash (repoId: string|null, modsetId: string|null) {
            if (repoId === undefined || repoId === null) throw new Error(`Repository with id ${repoId} not found`);
            if (modsetId === undefined || modsetId === null) throw new Error(`Modset with id ${modsetId} not found`);
            const repoStore = useRepoStore();
            const modset = repoStore.getModset(repoId, modsetId);
            if (modset === undefined) throw new Error(`Modset with id ${modsetId} not found`);
            modset.status = 'checking';
            const repo = repoStore.repos.get(repoId);
            if (repo === undefined) throw new Error(`Repository with id ${repoId} not found`);
            repo?.modsets?.set(modsetId, modset);
            repoStore.repos.set(repoId, repo);
            this.queue.push({ repoId: repoId, modsetId: modsetId, filesToCheck: 1, checkedFiles: 1 });
        },
        async next () {
            this.current = null;
            if (this.queue.length > 0) {
                this.current = this.queue.splice(0, 1)[0];
                if (this.current === null) throw new Error('Current hash object empty');
                System.calcModsetStatus(this.current.repoId, this.current.modsetId);
            }
        }
    }
});
