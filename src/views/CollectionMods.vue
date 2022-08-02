<template>
    <div class="modlist-c">
        <div class="modlist-c__content" v-if="collection !== undefined">
            <div>
                <div v-for="(mods, key, index) in collection.modsets" :key="index">
                    <div class="modlist-c__mods-headline">
                        <span
                            >{{ resolveModsetName(key) }} <span>({{ mods.length }})</span></span
                        >
                    </div>
                    <Modlist :mods="mods" :tree="tree" :modset-id="key"></Modlist>
                </div>
            </div>
            <Tooltip :text="'Toggle Tree'">
                <div role="button" @click="toggleTree()">
                    <mdicon name="file-tree" v-if="tree"></mdicon>
                    <mdicon name="format-list-bulleted" v-else></mdicon>
                </div>
            </Tooltip>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { Modset } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';
import Modlist from '../components/Modlist.vue';

const listOpen = ref(false);
const collection = computed(() => useRepoStore().currentCollection);

const tree = ref(false);
function toggleTree() {
    tree.value = !tree.value;
}
function resolveModsetName(id: string) {
    const foundModset = useRepoStore().currentRepository?.modsets.find((modset: Modset) => modset.id === id);
    if (foundModset !== undefined && foundModset !== null) {
        return foundModset.name;
    }
    return id;
}
</script>

<style lang="scss" scoped>
.modlist-c {
    position: relative;
    width: 100%;
    padding-block-start: 1rem;
    &__heading {
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
    &__mods {
        display: flex;
        flex-flow: row wrap;
        list-style-type: none;
    }

    &__mod {
        background: var(--c-surf-3);
        width: fit-content;
        border-radius: 999px;
        padding-inline: 0.5rem;
        padding-block: 0.25rem;
        margin-inline: 0.25rem;
        margin-block: 0.25rem;
    }
    &__mods-headline {
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

    &__content {
        display: grid;
        grid-template-columns: 1fr auto;
    }
}
</style>
