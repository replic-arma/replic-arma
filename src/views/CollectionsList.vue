<template>
    <div class="collections" v-if="repository !== undefined">
        <ul class="collections__list">
            <CollectionItem v-for="(collection, i) of repository.collections" :key="i" :collection="collection" />
        </ul>
        <CollectionAdd />
    </div>
</template>

<script lang="ts" setup>
import { useRepoStore } from '../store/repo';
import CollectionItem from '../components/CollectionItem.vue';
import CollectionAdd from '../components/CollectionAdd.vue';
const repository = useRepoStore().currentRepository;
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
