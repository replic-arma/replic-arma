<template>
    <div class="modlist">
        <div>
            <ModsetList v-for="(modset, index) of modsets" :key="index" :model="modset" :tree="tree"></ModsetList>
        </div>
        <Tooltip :text="'Toggle Tree'">
            <div role="button" @click="toggleTree()">
                <mdicon name="file-tree" v-if="tree"></mdicon>
                <mdicon name="format-list-bulleted" v-else></mdicon>
            </div>
        </Tooltip>
    </div>
</template>

<script lang="ts" setup>
import type { Collection, IReplicArmaRepository, Modset, ModsetMod } from '@/models/Repository';
import { computed } from '@vue/reactivity';
import { ref, type PropType } from 'vue';
import ModsetList from '../ModsetList.vue';
const props = defineProps({
    model: {
        type: Object as PropType<Collection>,
        required: true
    },
    repository: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
const tree = ref(false);
function toggleTree() {
    tree.value = !tree.value;
}
const modsets = computed(() => {
    const tmpModsets: Array<Modset> = [];
    if (props.model.modsets === undefined) return tmpModsets;
    Object.entries(props.model.modsets).forEach(([modsetId, modNames]) => {
        const foundModset = props.repository.modsets.find((modset: Modset) => modset.id === modsetId);
        if (foundModset !== undefined && foundModset !== null) {
            const foundModsetClone = { ...foundModset };
            foundModsetClone.mods = foundModsetClone.mods.filter((mod: ModsetMod) => modNames.includes(mod.name));
            tmpModsets.push(foundModsetClone);
        }
    });
    return tmpModsets;
});
</script>

<style lang="scss" scoped>
.modlist {
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
}
</style>
