<template>
    <ul class="servers">
        <ServerVue v-for="(server, i) of servers" :key="i" :server="server"></ServerVue>
        <li class="servers__empty" v-if="servers?.length === 0" v-t="'server.empty'"></li>
    </ul>
</template>

<script lang="ts" setup>
import ServerVue from '@/components/Server.vue';
import { useRepoStore } from '@/store/repo';
const servers = useRepoStore().currentRepository.game_servers;
</script>

<style lang="scss" scoped>
.servers {
    padding: 0;
    display: grid;
    gap: 1rem;
    list-style-type: none;
    &__empty {
        text-align: center;
    }
}
</style>
