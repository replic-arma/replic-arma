<template>
    <div class="collection" v-if="collection !== undefined">
        <div class="collection__heading">
            <mdicon name="chevron-left" size="55" @click="$router.back()" />
            <h1>{{ collection.name }}</h1>
        </div>
        <Subnavi :subnaviItems="subnaviItems"></Subnavi>
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import type { SubnaviItem } from '@/components/util/Subnavi.vue';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import Subnavi from '../components/util/Subnavi.vue';
const collection = useRepoStore().currentCollection;
const subnaviItems: SubnaviItem[] = [
    { label: 'Mods', link: `/repo/${useRouteStore().currentRepoID}/collection/${collection!.id}/mods` },
    { label: 'collections', link: `/repo/${useRouteStore().currentRepoID}/collection/${collection!.id}/settings` },
];
</script>

<style lang="scss" scoped>
.collection {
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto;
        font-size: 22pt;
        align-items: center;
        justify-content: center;
        span {
            cursor: pointer;
        }
        h1 {
            margin: 0;
            font-weight: bold;
            color: #333333;
        }
        .icon-group {
            align-items: center;
            justify-content: center;
            color: var(--c-text-3);
            .button {
                font-size: 20pt;
            }
        }
    }
}
</style>
