<template>
    <div class="modset-mods">
        <Modlist v-if="modset !== undefined" :mods="mods" :tree="tree" :modset-id="modset.id"></Modlist>
        <Tooltip :text="'Toggle Tree'">
            <div role="button" @click="toggleTree()">
                <mdicon name="file-tree" v-if="tree"></mdicon>
                <mdicon name="format-list-bulleted" v-else></mdicon>
            </div>
        </Tooltip>
    </div>
</template>

<script lang="ts" setup>
import type { ModsetMod } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { computed, ref } from 'vue';
import Modlist from '../components/Modlist.vue';
const modset = computed(() => useRepoStore().currentModset);
const mods = computed(() => useRepoStore().currentModset?.mods.map((mod: ModsetMod) => mod.name) ?? []);
const tree = ref(false);
function toggleTree() {
    tree.value = !tree.value;
}
</script>
<style lang="scss" scoped>
.modset-mods {
    display: grid;
    grid-template-columns: 1fr auto;
}
</style>
