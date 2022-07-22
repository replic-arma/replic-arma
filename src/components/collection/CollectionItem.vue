<template>
    <li class="collection" v-if="collection !== undefined">
        <div class="collection__info">
            <span class="collection__name">{{ collection.name }}</span>
            <small class="collection__description">{{ collection.description }}</small>
        </div>
        <span class="repo__status" :class="`status--${status}`">
            <status :status="status" :progress="0"></status>
        </span>
        <div class="collection__play" @click="play()">
            <span v-t="'play'"></span>
            <mdicon name="play" size="25" />
        </div>
        <router-link :to="'./collection/' + collection.id" class="collection__open button">
            <mdicon name="folder-open-outline"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts" setup>
import type { Collection } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRouteStore } from '@/store/route';
import { launchCollection } from '@/util/system/game';
import { computed, ref } from 'vue';
import Status from '../util/Status.vue';
interface Props {
    collection: Collection;
}
const props = defineProps<Props>();
async function play() {
    if (props.collection === undefined) return;
    await launchCollection(props.collection!, useRouteStore().currentRepoID ?? '');
}

const status = computed(() => {
    const cacheData = useHashStore().cache.find((cacheModset) => cacheModset.id === useRouteStore().currentRepoID);
    if (cacheData === undefined) return 'checking';
    if (cacheData.outdatedFiles.length > 0 || cacheData.missingFiles.length > 0) {
        return 'outdated';
    }
    for (const modsetId of Object.keys(props.collection.modsets)) {
        if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === modsetId)
            return 'downloading';
    }
    return 'ready';
});
</script>
<style lang="scss" scoped>
.collection {
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

    &__play {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 5rem;
        color: grey;
        & > span:first-child {
            color: var(--c-surf-2);
        }
        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }

    &__collection {
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
