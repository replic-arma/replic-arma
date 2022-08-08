<template>
    <div class="replic-checkbox" v-if="modset !== undefined">
        <label class="replic-checkbox__thumb" :for="'check-' + modset.name" @click="update()">
            <mdicon v-if="model === 1" name="check" />
            <mdicon v-if="model === -1" name="minus" />
        </label>
        <label class="replic-checkbox__label" :for="'check-' + modset.name" @click="update()"
            ><span>{{ modset.name }}</span></label
        >
        <CollectionModsetModlist :modset="modset" :collection="collection" />
    </div>
</template>
<script lang="ts" setup>
import type { Collection, Modset, ModsetMod } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { ref, watch } from 'vue';
import CollectionModsetModlist from './CollectionModsetModlist.vue';
interface Props {
    modset: Modset;
    collection: Collection;
}
const props = defineProps<Props>();
const model = ref(0);

checkStatus();
function checkStatus() {
    if (props.collection.modsets !== undefined && props.modset.id in props.collection.modsets) {
        if (props.collection.modsets[props.modset.id]?.length !== props.modset.mods.length) {
            model.value = -1;
        } else {
            model.value = 1;
        }
    } else {
        model.value = 0;
    }
}
// Currently dispatches everytime we change anything, might not be perfect for performance
watch(props.collection, () => {
    checkStatus();
});

function update() {
    if (props.collection.modsets !== undefined && props.modset.id in props.collection.modsets) {
        delete useRepoStore().currentCollection!.modsets![props.modset.id];
    } else {
        useRepoStore().currentCollection!.modsets = {
            ...useRepoStore().currentCollection!.modsets,
            ...{ [props.modset.id]: props.modset.mods.map((mod: ModsetMod) => mod.name) },
        };
    }
    checkStatus();
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
    &__label span {
        margin-inline-start: 1rem;
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
