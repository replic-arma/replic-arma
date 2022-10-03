<template>
    <li class="modlist-item" :class="styleClass">
        <Popper :hover="true" :arrow="true" style="--tooltip-font-size: 0.9em">
            <span>
                <mdicon :name="isOutdated ? 'close' : 'check'" />
                <span>{{ name }}</span>
            </span>
            <template #content>
                <div>{{ path }}</div>
                <div>{{ size }}</div>
            </template>
        </Popper>
    </li>
</template>

<script lang="ts" setup>
import { useRepository } from '@/composables/useRepository';
import type { Modset, ModsetMod } from '@/models/Repository';
import type { ICacheItem } from '@/store/hash';
import { useRouteStore } from '@/store/route';
import type { HashResponseItem } from '@/util/system/hashes';
import { computedEager } from '@vueuse/core';
import { computed, type PropType } from 'vue';
import Popper from 'vue3-popper';
const props = defineProps({
    hashCache: {
        type: Object as PropType<ICacheItem>
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
const styleClass = computedEager(() => {
    return isOutdated.value ? 'outdated' : 'ready';
});

const size = computed(() => {
    if (props.modsetCache === undefined) return 0;
    const mod = props.modsetCache.mods.find((mod: ModsetMod) => mod.name === props.name);
    if (mod !== undefined) {
        return mod.size !== undefined ? Number(mod.size / 10e5).toFixed(2) + ' MB' : '0';
    }
    return 0;
});

const path = computed(() => {
    return `${repository.value?.downloadDirectoryPath}\\${props.name}`;
});
</script>

<style lang="scss">
.modlist-item {
    background: var(--c-surf-3);
    width: fit-content;
    border-radius: 999px;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
    margin-inline: 0.25rem;
    margin-block: 0.25rem;
    font-weight: bold;
}
</style>
