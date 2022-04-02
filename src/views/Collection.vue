<template>
    <div class="collection" v-if="collection !== undefined">
        <div class="collection__heading" >
            <mdicon name="chevron-left" size="55" @click="$router.back()" />
            <h1>{{ collection.name }}</h1>
            <div class="icon-group">
                <button class="button" v-t="'save'"></button>
            </div>
        </div>
        <TabsVue :tabItems="subnaviItems" />
    </div>
</template>

<script lang="ts" setup>
import CollectionMods from '@/components/CollectionMods.vue';
import LaunchVue from '@/components/settings/Launch.vue';
import TabsVue from '@/components/util/Tabs.vue';
import type { TabsItem } from '@/components/util/Tabs.vue';
import { useRepoStore } from '@/store/repo';
import { computed, shallowRef } from 'vue';

const subnaviItems: TabsItem[] = [
    { label: 'General', component: shallowRef(CollectionMods) },
    { label: 'Launch Options', component: shallowRef(LaunchVue) },
];
const collection = computed(() => useRepoStore().currentCollection);
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
