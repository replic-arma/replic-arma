<template>
    <li class="modset" v-if="modset !== undefined">
        <div class="modset__info">
            <span class="modset__name">{{ modset.name }}</span>
            <small class="modset__description">{{ modset.description }}</small>
        </div>
        <span class="repo__status" :class="`status--${status}`">
            <Status :status="status" :progress="progress"></Status>
        </span>
        <div class="button modset__play" @click="play()">
            <span v-t="'play'"></span>
            <mdicon name="play" size="35" />
        </div>
        <router-link :to="'./modset/' + modset.id" class="modset__open button">
            <mdicon name="folder-open"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts" setup>
import { useHashStore } from '@/store/hash';
import type { IHashItem } from '@/store/hash';
import { useRouteStore } from '@/store/route';
import { computed } from 'vue';
import { useDownloadStore } from '@/store/download';
import Status from './util/Status.vue';
import { launchModset } from '@/util/system/game';
const props = defineProps({
    modset: {
        type: Object,
        default: null,
    },
});
const status = computed(() => {
    const cacheData = useHashStore().cache.find((cacheModset) => cacheModset.id === props.modset.id);
    if (cacheData === undefined) return 'checking';
    if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === props.modset.id)
        return 'downloading';
    if (cacheData.outdatedFiles.length > 0 || cacheData.missingFiles.length > 0) {
        return 'outdated';
    } else {
        return 'ready';
    }
});
const progress = computed(() => {
    if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === props.modset.id) {
        return Number(
            Number(
                (useDownloadStore().current!.received / 10e5 / (useDownloadStore().current!.size / 10e8)) * 100
            ).toFixed(0)
        );
    } else {
        if (useHashStore().current === null || useHashStore().current?.repoId !== useRouteStore().currentRepoID)
            return 0;
        const { checkedFiles, filesToCheck } = useHashStore().current as IHashItem;
        return Math.floor((checkedFiles / filesToCheck) * 100);
    }
});
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
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;

    &:hover {
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__name {
        font-weight: bold;
        font-size: 18pt;
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

    &__play {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 5rem;
        & > span:first-child {
            color: var(--c-surf-2);
        }
        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }

    &__modset {
        list-style-type: none;
        color: var(--c-surf-2);
    }

    &__info {
        display: grid;
        padding-inline-start: var(--space-sm);
    }

    &__description {
        color: var(--c-text-3);
    }
}
</style>
