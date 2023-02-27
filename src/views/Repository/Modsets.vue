<template>
    <ul class="modsets" v-if="model !== undefined">
        <ModsetItem v-for="(modset, i) of model.modsets" :key="i" :modset="modset" :modsetIndex="modset.id" />
    </ul>
    <!-- <ModsetAdd></ModsetAdd>s -->
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import ModsetItem from '@/components/modset/ModsetItem.vue';
import ModsetAdd from '@/components/modset/ModsetAdd.vue';
import type { IReplicArmaRepository } from '@/models/Repository';
defineProps({
    model: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
</script>

<style lang="scss" scoped>
.modsets {
    padding: 0;
    display: grid;
    gap: 1rem;
}
</style>
