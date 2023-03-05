<template>
    <li class="server" v-if="server !== undefined">
        <div class="server__info">
            <span class="server__host">{{ server.host }}</span>
            <small class="server__name">{{ server.name }}</small>
        </div>
        <span class="server__port">{{ server.port }}</span>
        <span class="server__password">
            <template v-if="server.password === undefined || server.password === ''">
                <mdicon name="lock-open-variant-outline" /> -
            </template>
            <template v-else> <mdicon name="lock-outline" />{{ server.password }} </template>
        </span>
        <span class="server__modset">{{ server.modset !== undefined ? server.modset : '-' }}</span>
        <PlayButton @play="play()"></PlayButton>
    </li>
</template>
<script lang="ts" setup>
import type { GameServer } from '@/models/Repository';
import { useRouteStore } from '@/store/route';
import { launchModset } from '@/util/system/game';
import PlayButton from '@/components/PlayButton.vue';

interface Props {
    server: GameServer;
}
const props = defineProps<Props>();

function play() {
    if (props.server.modset === undefined) throw new Error('Server Modset undefined');
    launchModset(props.server.modset, useRouteStore().currentRepoID ?? '', props.server);
}
</script>
<style lang="scss" scoped>
.server {
    block-size: 5rem;
    padding-inline: 1rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 2fr 0.75fr 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: var(--shadow-1);
    border-radius: 12px;
    overflow: hidden;
    &:hover {
        // box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__host {
        font-weight: bold;
        font-size: 14pt;
    }

    &__name {
        color: var(--c-text-3);
    }

    &__port {
        font-size: 14pt;
        color: var(--c-text-3);
        text-align: center;
    }

    &__password {
        font-size: 14pt;
    }

    &__info {
        display: grid;
    }
}
</style>
