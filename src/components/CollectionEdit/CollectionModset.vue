<template>
    <li class="replic-checkbox" v-if="modset !== undefined">
        <label class="replic-checkbox__thumb" :for="'check-' + modset.name" @click="update()">
            <mdicon v-if="model === 1" name="check" />
            <mdicon v-if="model === -1" name="minus" />
        </label>
        <label class="replic-checkbox__label" :for="'check-' + modset.name" @click="update()"
            ><span>{{ modset.name }}</span></label
        >
        <CollectionModsetModlist :modset="modset" :collection="collection" />
    </li>
</template>
<script lang="ts" setup>
import type { Collection, Modset, ModsetMod } from '@/models/Repository';
import { computed, ref } from 'vue';
import CollectionModsetModlist from './CollectionModsetModlist.vue';
interface Props {
    modset: Modset;
    collection: Collection;
}
const props = defineProps<Props>();
const model = computed(() => {
    if (props.collection.modsets !== undefined && props.modset.id in props.collection.modsets) {
        if (props.collection.modsets[props.modset.id]?.length !== props.modset.mods.length) {
            return -1;
        } else {
            return 1;
        }
    } else {
        return 0;
    }
});
const collection = ref(props.collection);

async function update() {
    if (collection.value.modsets !== undefined && props.modset.id in props.collection.modsets) {
        delete collection.value.modsets![props.modset.id];
    } else {
        collection.value.modsets = {
            ...collection.value.modsets,
            ...{ [props.modset.id]: props.modset.mods.map((mod: ModsetMod) => mod.name) }
        };
    }
}
</script>

<style lang="scss">
.replic-checkbox {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    &__check {
        display: none;
    }

    &__check:checked ~ div {
        display: block;
    }

    &__label {
        cursor: pointer;
    }
    &__thumb {
        content: '';
        block-size: 2rem;
        inline-size: 2rem;
        border-radius: 2rem;
        background: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-inline-end: 1rem;
        cursor: pointer;
    }
    &:hover &__folder {
        visibility: visible;
    }
    &__folder {
        visibility: hidden;
        margin-left: auto;
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
        border-radius: 2rem;
        cursor: pointer;
        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }
}
</style>
