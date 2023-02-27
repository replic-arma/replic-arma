<template>
    <mdicon class="replic-checkbox__folder" name="folder-open-outline" @click="isOpen = true"></mdicon>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span>{{ modset.name }}</span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <div class="collection-modlist__mods" v-if="modset !== undefined && collection !== undefined">
                    <CollectionModsetModlistMod
                        v-for="(mod, i) of orderedMods"
                        :label="mod.name"
                        :key="i"
                        :default="collection.modsets![props.modset.id]?.includes(mod.name) ?? false"
                        @add="addMod($event)"
                        @remove="removeMod($event)"
                    ></CollectionModsetModlistMod>
                </div>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import type { Modset, Collection } from '@/models/Repository';
import { computed, ref } from 'vue';
import CollectionModsetModlistMod from './CollectionModsetModlistMod.vue';
interface Props {
    modset: Modset;
    collection: Collection;
}
const props = defineProps<Props>();
const isOpen = ref(false);
const collectionData = ref(props.collection);
function addMod(modName: string) {
    if (collectionData.value.modsets !== undefined && props.modset.id in collectionData.value.modsets) {
        collectionData.value.modsets![props.modset.id] = [
            ...(collectionData.value.modsets![props.modset.id] ?? []),
            ...[modName]
        ];
    } else {
        collectionData.value.modsets = {
            ...collectionData.value.modsets,
            ...{ [props.modset.id]: [modName] }
        };
    }
}
function removeMod(modName: string) {
    collectionData.value.modsets![props.modset.id] =
        collectionData.value.modsets![props.modset.id]?.filter((modsetModName: string) => modsetModName !== modName) ??
        [];
    if (collectionData.value.modsets![props.modset.id]!.length === 0) {
        delete collectionData.value.modsets![props.modset.id];
    }
}

const orderedMods = computed(() => {
    const unorderedMods = props.modset.mods;
    return unorderedMods.sort((a, b) => a.name.localeCompare(b.name));
});
</script>
<style lang="scss" scoped>
.collection-modlist {
    &__mods {
        display: flex;
        flex-flow: row wrap;
        list-style-type: none;
    }
}
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &__content {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
