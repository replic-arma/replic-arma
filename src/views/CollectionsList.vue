<template>
    <div class="collections" v-if="repository !== undefined">
        <ul class="collections__list">
            <CollectionItemVue v-for="(collection, i) of repository.collections" :key="i" :collection="collection" />
        </ul>
        <mdicon name="plus" class="add-button" role="button"></mdicon>
        <CollectionAddVue />
    </div>
</template>

<script lang="ts" setup>
import { useRepoStore } from '../store/repo';
import CollectionItemVue from '@/components/CollectionItem.vue';
import CollectionAddVue from '@/components/CollectionAdd.vue';
import { computed } from 'vue';
const repository = computed(() => useRepoStore().currentRepository);
</script>

<style lang="scss" scoped>
.collections {
    &__list {
        padding: 0;
        display: grid;
        gap: var(--space-sm);
    }
}
</style>
