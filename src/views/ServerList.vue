<template>
    <ul class="servers">
       <server v-for="(server, i) of servers" :key="i" :server="server"></server>
    </ul>
</template>

<script lang="ts">
import ServerVue from '@/components/Server.vue';
import { GameServer } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Server: ServerVue
    }
})
export default class ServerListVue extends Vue {
    private servers!: GameServer[];
    private repositoryIndex!: number;
    private repoStore = useRepoStore();
    public created (): void {
        this.repositoryIndex = +this.$router.currentRoute.value.params.id;
        this.servers = this.repoStore.getRepo(this.repositoryIndex)?.game_servers ?? [];
    }
}
</script>

<style lang="scss" scoped>
.servers {
  padding: 0;
  li {
    margin-bottom: 1rem;
  }
}
</style>
