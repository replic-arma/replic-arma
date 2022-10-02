<template>
    <ul class="modlist" :class="tree ? 'tree' : 'list'">
        <ModListItem
            v-for="(modName, index) of orderedMods"
            :name="modName"
            :hash-cache="hashCache"
            :modset-cache="modsetCache"
            :key="index"
        ></ModListItem>
    </ul>
</template>

<script lang="ts" setup>
import type { Modset, ModsetMod } from '@/models/Repository';
import { useHashStore, type ICacheItem } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { computed } from 'vue';
import ModListItem from './ModListItem.vue';
interface Props {
    mods: Array<ModsetMod>;
    tree: boolean;
    modsetId: string;
}
const tmpCache = useRepoStore().modsetCache;
const hashCache = computed(() => useHashStore().cache.find((item: ICacheItem) => item.id === props.modsetId));
const modsetCache = computed(() => {
    if (tmpCache === null) return;
    return tmpCache.find((item: Modset) => item.id === props.modsetId);
});
const props = defineProps<Props>();
const orderedMods = Array.from(props.mods.map(mode => mode.name)).sort((a, b) => a.localeCompare(b));
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
        line-height: 2em; /* default list item's `line-height` */
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
