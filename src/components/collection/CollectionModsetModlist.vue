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
                    <!-- <span class="collection-modlist__mod"  :key="i">{{ mod.name }}</span> -->
                    <CollectionModsetModlistMod
                        v-for="(mod, i) of modset.mods"
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
import type { Modset, Collection, ModsetMod } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { ref } from 'vue';
import CollectionModsetModlistMod from './CollectionModsetModlistMod.vue';
interface Props {
    modset: Modset;
    collection: Collection;
}
const props = defineProps<Props>();
const isOpen = ref(false);
function addMod(modName: string) {
    if (props.collection.modsets !== undefined && props.modset.id in props.collection.modsets) {
        props.collection.modsets![props.modset.id] = [
            ...(props.collection.modsets![props.modset.id] ?? []),
            ...[modName],
        ];
    } else {
        useRepoStore().currentCollection!.modsets = {
            ...useRepoStore().currentCollection!.modsets,
            ...{ [props.modset.id]: [modName] },
        };
    }
}
function removeMod(modName: string) {
    props.collection.modsets![props.modset.id] =
        props.collection.modsets![props.modset.id]?.filter((modsetModName: string) => modsetModName !== modName) ?? [];
    if (props.collection.modsets![props.modset.id]!.length === 0) {
        delete useRepoStore().currentCollection!.modsets![props.modset.id];
    }
}
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
