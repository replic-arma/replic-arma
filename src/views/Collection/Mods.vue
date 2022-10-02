<template>
    <Loader v-if="model === null" />
    <CollectionModlist v-else :model="model" :repository="repository"></CollectionModlist>
</template>

<script lang="ts" setup>
import type { Collection, IReplicArmaRepository } from '@/models/Repository';
import type { PropType } from 'vue';
import Loader from '../../components/util/Loader.vue';
import CollectionModlist from '../../components/Collection/CollectionModlist.vue';
defineProps({
    model: {
        type: Object as PropType<Collection>,
        required: true
    },
    repository: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
</script>
