import { ReplicArmaRepository } from '@/models/Repository';
import { defineStore } from 'pinia';

export const useRepoStore = defineStore('repo', {
    state: (): {repos: ReplicArmaRepository[]} => ({
        repos: []
    }),
    getters: {
        getRepos: (state) => {
            return state.repos;
        },
        getRepo: (state) => {
            return (index: number) => state.repos[index];
        }
    },
    actions: {
        addRepo (repo: ReplicArmaRepository) {
            this.repos.push(repo);
        },
        removeRepo (index: number) {
            this.repos.splice(index, 1);
        }
    }
});
