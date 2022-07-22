<template>
    <div class="collections" >
        <ul class="collections__list" v-if="repository !== undefined">
            <CollectionItem v-for="(collection, i) of repository.collections" :key="i" :collection="collection" />
        </ul>
        <CollectionAdd />
    </div>
</template>

<script lang="ts" setup>
import { useRepoStore } from '../store/repo';
import CollectionItem from '../components/collection/CollectionItem.vue';
import CollectionAdd from '../components/collection/CollectionAdd.vue';
import { computed } from 'vue';
const repository = computed(() => useRepoStore().currentRepository);
</script>

<style lang="scss" scoped>
.collections {
    &__list {
        padding: 0;
        display: grid;
        gap: 1rem;
    }
}
</style>
