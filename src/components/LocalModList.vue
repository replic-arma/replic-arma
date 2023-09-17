<template>
    <div v-if="model.localMods !== undefined">
        <div class="modset-list">
            <span
                >Local Mods <span>({{ model.localMods.length }})</span></span
            >
        </div>
        <ul class="modlist" :class="tree ? 'tree' : 'list'">
            <Mod
                v-for="mod of model.localMods"
                :name="mod.name"
                :path="mod.path"
                :key="mod.name"
                :display-icon="true"
            ></Mod>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import type { Collection } from '@/models/Repository';
import type { PropType } from 'vue';
import Mod from './Mod.vue';

defineProps({
    model: {
        type: Object as PropType<Collection>,
        required: true
    },
    tree: {
        type: Boolean
    }
});
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
.modset-list {
    width: 100%;
    padding-block-start: 1rem;
    display: grid;
    grid-template-columns: auto 1fr;
    margin-inline-end: 0.5rem;
    gap: 1rem;
    &::after {
        content: '';
        height: 2px;
        background: grey;
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
    }
}
</style>
