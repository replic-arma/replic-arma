<template>
    <div class="collections">
        <ul class="collections__list" v-if="model !== undefined">
            <CollectionItem v-for="(collection, i) of model.collections" :key="i" :collection="collection" />
        </ul>
        <CollectionAdd />
    </div>
</template>

<script lang="ts" setup>
import CollectionItem from '@/components/Collection/CollectionItem.vue';
import CollectionAdd from '@/components/Collection/CollectionAdd.vue';
import type { PropType } from 'vue';
import type { IReplicArmaRepository } from '@/models/Repository';
defineProps({
    model: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
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
