<template>
    <ul class="servers">
        <ServerItem v-for="(server, i) of servers" :key="i" :server="server" />
        <li class="servers__empty" v-if="servers?.length === 0" v-t="'server.empty'"></li>
    </ul>
</template>

<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { computed } from 'vue';
import ServerItem from '../components/ServerItem.vue';
const servers = computed(() => useRepoStore().currentRepository?.game_servers);
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
