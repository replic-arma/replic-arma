<template>
    <ul class="servers">
        <ServerItem v-for="(server, i) of model.game_servers" :key="i" :server="server" />
        <li class="servers__empty" v-if="model.game_servers?.length === 0" v-t="'server.empty'"></li>
    </ul>
</template>

<script lang="ts" setup>
import type { IReplicArmaRepository } from '@/models/Repository';
import type { PropType } from 'vue';
import ServerItem from '@/components/Server/ServerItem.vue';
defineProps({
    model: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
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
