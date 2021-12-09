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
            if (repo.image === undefined) repo.image = 'https://cdn.discordapp.com/channel-icons/834500277582299186/62046f86f4013c9a351b457edd4199b4.png?size=32';
            this.repos.push(repo);
        },
        removeRepo (index: number) {
            this.repos.splice(index, 1);
        }
    }
});
