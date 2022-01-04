<template>
    <ul class="servers">
       <server v-for="(server, i) of servers" :key="i" :server="server"></server>
       <li class="servers__empty" v-if="servers.length === 0">{{$t('server.empty')}}</li>
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
    private repositoryIndex!: string;
    private repoStore = useRepoStore();
    public created (): void {
        this.repositoryIndex = this.$router.currentRoute.value.params.id as string;
        this.servers = Array.from(this.repoStore.getRepo(this.repositoryIndex)?.game_servers?.values() ?? []);
    }
}
</script>

<style lang="scss" scoped>
.servers {
    padding: 0;
    display: grid;
    gap: 1rem;
    list-style-type: none;
    &__empty{
        text-align: center;
    }
}
</style>
