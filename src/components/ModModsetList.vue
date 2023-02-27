<template>
    <ul class="modlist" :class="tree ? 'tree' : 'list'">
        <ModsetModItem
            v-for="(mod, index) of mods"
            :name="mod.name"
            :hash-cache="hashCache"
            :modset-cache="modsetCache"
            :key="index"
        ></ModsetModItem>
    </ul>
</template>

<script lang="ts" setup>
import type { Modset, ModsetMod } from '@/models/Repository';
import { useHashStore, type ICacheItem } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { computed } from 'vue';
import ModsetModItem from './ModsetMod.vue';
interface Props {
    mods: Array<ModsetMod>;
    tree: boolean;
    modsetId: string;
}
const hashCache = computed(() => useHashStore().cache.find((item: ICacheItem) => item.id === props.modsetId));
const modsetCache = computed(() => {
    if (useRepoStore().modsetCache === null) return;
    return useRepoStore().modsetCache!.find((item: Modset) => item.id === props.modsetId);
});
const props = defineProps<Props>();
</script>

<style lang="scss" scoped>
.modlist {
    list-style-type: none;
    padding: 0;
    list-style: none;
    position: relative;
    margin-left: 0.5em;
}
.list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.tree {
    &:before {
        content: '';
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border-left: 1px solid;
    }

    li {
        margin: 0;
        padding: 0 1.5em; /* indentation + .5em */
        margin-block: 0.5em; /* default list item's `line-height` */
        font-weight: bold;
        position: relative;
    }

    li:before {
        content: '';
        display: block;
        width: 10px; /* same with indentation */
        height: 0;
        border-top: 1px solid;
        margin-top: -1px; /* border top width */
        position: absolute;
        top: 1em; /* (line-height/2) */
        left: 0;
    }

    li:last-child:before {
        background: inherit; /* same with body background */
        height: auto;
        top: 1em; /* (line-height/2) */
        bottom: 0;
    }
}
</style>
