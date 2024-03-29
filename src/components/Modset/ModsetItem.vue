<template>
    <li class="modset" v-if="modset !== undefined">
        <div class="modset__info">
            <span class="modset__name">{{ modset.name }}</span>
            <small class="modset__description">{{ modset.description }}</small>
        </div>
        <span class="repo__status" :class="`status--${status}`">
            <Status :status="status" :progress="progress"></Status>
        </span>
        <PlayButton @play="play()"></PlayButton>
        <router-link :to="'./modset/' + modset.id + '/mods'" class="modset__open button">
            <mdicon name="folder-open-outline"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts" setup>
import { useRouteStore } from '@/store/route';
import Status from '@/components/util/Status.vue';
import { launchModset } from '@/util/system/game';
import PlayButton from '@/components/PlayButton.vue';
import type { Modset } from '@/models/Repository';
import { useModsetStatus } from '@/composables/useModsetStatus';
interface Props {
    modset: Modset;
}
const props = defineProps<Props>();
const { status, progress } = useModsetStatus(useRouteStore().currentRepoID ?? '', props.modset.id);
function play() {
    if (props.modset === undefined) return;
    launchModset(props.modset.id, useRouteStore().currentRepoID ?? '');
}
</script>
<style lang="scss" scoped>
.modset {
    height: 5rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 10%;
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: var(--shadow-1);
    border-radius: 12px;
    overflow: hidden;

    &:hover {
        // box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__name {
        font-weight: bold;
        font-size: 14pt;
    }

    &__open {
        cursor: pointer;
        background-color: var(--c-surf-3);
        inline-size: 0;
        justify-self: flex-end;
        block-size: 100%;
        inline-size: 100%;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &::before {
            content: '';
            transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
            background-color: var(--c-surf-4);
            border-top-right-radius: inherit;
            border-bottom-right-radius: inherit;
            position: absolute;
            inset: 0;
            display: block;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
        }
    }

    &:hover #{&}__open::before {
        inset-inline-end: 90%;
    }

    &__modset {
        list-style-type: none;
        color: var(--c-surf-2);
    }

    &__info {
        display: grid;
        padding-inline-start: 1rem;
    }

    &__description {
        color: var(--c-text-3);
    }
}
</style>
