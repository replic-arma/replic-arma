<template>
    <Mod :is-outdated="isOutdated" :path="path" :size="size" :name="name" :display-icon="true"></Mod>
</template>

<script lang="ts" setup>
import { useRepository } from '@/composables/useRepository';
import type { Modset, ModsetMod } from '@/models/Repository';
import { useRouteStore } from '@/store/route';
import type { HashResponse, HashResponseItem } from '@/util/system/hashes';
import { computed, type PropType } from 'vue';
import Mod from '@/components/Mod.vue';
const props = defineProps({
    hashCache: {
        type: Object as PropType<HashResponse>
    },
    modsetCache: {
        type: Object as PropType<Modset>
    },
    name: {
        type: String,
        required: true
    }
});
const { repository } = useRepository(useRouteStore().currentRepoID ?? '');
const isOutdated = computed(() => {
    if (props.hashCache === undefined) return true;
    return (
        props.hashCache.missing
            .map((hashItem: HashResponseItem) => hashItem.file.split('\\').includes(props.name))
            .includes(true) ||
        props.hashCache.outdated
            .map((hashItem: HashResponseItem) => hashItem.file.split('\\').includes(props.name))
            .includes(true)
    );
});

const size = computed(() => {
    if (props.modsetCache === undefined) return '0';
    const mod = props.modsetCache.mods.find((mod: ModsetMod) => mod.name === props.name);
    if (mod !== undefined) {
        return mod.size !== undefined ? `${Number(mod.size / 10e5).toFixed(2)} MB` : '0';
    }
    return '0';
});

const path = computed(() => {
    return `${repository.value?.downloadDirectoryPath}\\${props.name}`;
});
</script>
