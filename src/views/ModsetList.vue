<template>
    <ul class="modsets" v-if="repository !== undefined">
        <ModsetItem v-for="(modset, i) of repository.modsets" :key="i" :modset="modset" :modsetIndex="modset.id" />
    </ul>
    <!-- <ModsetAdd></ModsetAdd>s -->
</template>

<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { computed } from 'vue';
import ModsetItem from '../components/modset/ModsetItem.vue';
import ModsetAdd from '../components/modset/ModsetAdd.vue';
const repository = computed(() => useRepoStore().currentRepository);
</script>

<style lang="scss" scoped>
.modsets {
    padding: 0;
    display: grid;
    gap: 1rem;
}
</style>
