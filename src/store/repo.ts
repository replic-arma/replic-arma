import { ReplicArmaRepository } from '@/models/Repository';
import { defineStore } from 'pinia';

export const useRepoStore = defineStore('repo', {
    state: (): {repos: Map<string, ReplicArmaRepository>} => ({
        repos: new Map<string, ReplicArmaRepository>()
    }),
    getters: {
        getRepos: (state) => {
            return Array.from(state.repos.values());
        },
        getRepo: (state) => {
            return (id: string) => state.repos.get(id);
        }
    },
    actions: {
        addRepo (repo: ReplicArmaRepository) {
            if (repo.image === undefined) repo.image = 'https://cdn.discordapp.com/channel-icons/834500277582299186/62046f86f4013c9a351b457edd4199b4.png?size=32';
            this.repos.set(repo.id, repo);
        },
        removeRepo (id: string) {
            this.repos.delete(id);
        }
    }
});
