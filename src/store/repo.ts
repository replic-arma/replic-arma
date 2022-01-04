import { GameServer, Modset, ReplicArmaRepository } from '@/models/Repository';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
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
        },
        addServerToRepo (id: string, server: GameServer) {
            const repositoriy = this.repos.get(id);
            server.id = uuidv4();
            repositoriy?.game_servers?.set(server.id, server);
            if (repositoriy === undefined) return;
            this.repos.set(id, repositoriy);
        },
        addModsetToRepo (id: string, modset: Modset) {
            const repositoriy = this.repos.get(id);
            modset.id = uuidv4();
            repositoriy?.modsets?.set(modset.id, modset);
            if (repositoriy === undefined) return;
            this.repos.set(id, repositoriy);
        },
        loadRepositories () {
            // TODO call tauri
        },
        saveRepoState (id: string) {
            // TODO call tauri
        }
    }
});
