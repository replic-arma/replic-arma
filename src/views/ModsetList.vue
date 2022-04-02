<template>
    <ul class="modsets" v-if="repository !== undefined">
        <Modset v-for="(modset, i) of repository.modsets" :key="i" :modset="modset" :modsetIndex="modset.id" />
    </ul>
    <mdicon name="plus" class="add-button" role="button"></mdicon>
    <ModsetAddVue />
</template>

<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { computed } from 'vue';
import Modset from '../components/Modset.vue';
const repository = computed(() => useRepoStore().currentRepository);
</script>

<style lang="scss" scoped>
.modsets {
    padding: 0;
    display: grid;
    gap: 1rem;
}
</style>
