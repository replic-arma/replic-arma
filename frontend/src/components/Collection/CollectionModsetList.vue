<template>
    <div>
        <div class="modset-list">
            <span
                >{{ model.name }} <span>({{ model.mods.length }})</span></span
            >
        </div>
        <ModModsetList :mods="model.mods" :tree="tree" :modset-id="model.id"></ModModsetList>
    </div>
</template>

<script lang="ts" setup>
import type { Modset } from '@/models/Repository';
import type { PropType } from 'vue';
import ModModsetList from '@/components/ModModsetList.vue';

defineProps({
    model: {
        type: Object as PropType<Modset>,
        required: true
    },
    tree: {
        type: Boolean,
        required: true
    }
});
</script>

<style lang="scss" scoped>
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
