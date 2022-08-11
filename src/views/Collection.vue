<template>
    <div class="collection">
        <template v-if="collection !== undefined">
            <div class="collection__heading">
                <Tooltip text="Go Back">
                    <mdicon name="chevron-left" size="45" @click="goToRepo()" />
                </Tooltip>
                <h1>{{ collection.name }}</h1>
                <div class="icon-group">
                    <Tooltip text="Downloads" position="bottom">
                        <Downloads />
                    </Tooltip>
                    <button class="button" v-t="'play'" @click="play()">
                        <mdicon name="play" />
                    </button>
                </div>
            </div>
            <Subnavi v-if="collection !== undefined" :subnaviItems="subnaviItems"></Subnavi>
            <router-view />
        </template>
        <Loader v-else />
    </div>
</template>

<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { computed } from 'vue';
import { launchCollection } from '@/util/system/game';
import { useRouter } from 'vue-router';
import Loader from '../components/util/Loader.vue';
import Downloads from '../components/download/Downloads.vue';
import Subnavi from '../components/util/Subnavi.vue';
const collection = computed(() => useRepoStore().currentCollection);
const subnaviItems = computed(() => {
    return [
        {
            label: 'mods',
            link: `/repo/${useRouteStore().currentRepoID}/collection/${useRouteStore().currentCollectionID}/mods`,
        },
        {
            label: 'edit',
            link: `/repo/${useRouteStore().currentRepoID}/collection/${useRouteStore().currentCollectionID}/edit`,
        },
    ];
});
const router = useRouter();

async function play() {
    if (useRepoStore().currentCollection === undefined) return;
    await launchCollection(useRepoStore().currentCollection!, useRouteStore().currentRepoID ?? '');
}

function goToRepo() {
    router.push('/repo/' + useRouteStore().currentRepoID + '/collections');
}
</script>

<style lang="scss" scoped>
.collection {
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto;
        font-size: 14pt;
        align-items: center;
        justify-content: center;
        span {
            cursor: pointer;
        }
        h1 {
            margin: 0;
            font-weight: bold;
        }
        .icon-group {
            display: flex;
            gap: 1rem;
            align-items: center;
            justify-content: center;
            color: var(--c-text-3);
            .button {
                font-size: 20pt;
            }
        }
    }
}

.collection-mods {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    .item-group {
        padding: 0;
        list-style-type: none;
        gap: 0.75rem;
        display: flex;
        flex-direction: column;
        .item {
            block-size: 3rem;
            display: flex;
            border-radius: 0.5rem;
            align-items: center;
            padding-inline: 0.75rem;
            &:hover {
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
            }
        }
    }
}
</style>
