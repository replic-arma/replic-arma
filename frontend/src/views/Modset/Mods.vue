<template>
    <Loader v-if="model == null" />
    <div class="modset-mods" v-else>
        <ModModsetList :mods="model.mods" :tree="tree" :modset-id="model.id"></ModModsetList>
        <Tooltip :text="'Toggle Tree'">
            <div role="button" @click="toggleTree()">
                <mdicon name="file-tree" v-if="tree"></mdicon>
                <mdicon name="format-list-bulleted" v-else></mdicon>
            </div>
        </Tooltip>
    </div>
</template>

<script lang="ts" setup>
import type { Modset } from '@/models/Repository';
import { ref, type PropType } from 'vue';
import Loader from '@/components/util/Loader.vue';
import ModModsetList from '@/components/ModModsetList.vue';
defineProps({
    model: {
        type: Object as PropType<Modset>,
        required: true
    }
});
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
