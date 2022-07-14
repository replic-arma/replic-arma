<template>
    <div class="add-button" @click="isOpen = true">
        <mdicon name="plus" role="button"></mdicon>
    </div>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'collection.add'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <div class="txt">
                    <label for="collectionName" v-t="'collection.name'"></label>
                    <div class="txt__input-wrapper">
                        <input class="txt__input" type="text" name="collectionName" v-model="collectionName" />
                    </div>
                </div>
                <button class="button" v-once @click="addCollection" v-t="'collection.add'"></button>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { notify } from '@kyvg/vue3-notification';
import { ref } from 'vue';
const collectionName = ref('');
const isOpen = ref(false);
function addCollection() {
    if (collectionName.value === null) return;
    useRepoStore()
        .addCollection(useRouteStore().currentRepoID ?? '', { name: collectionName.value })
        .then(() => {
            useRepoStore().save();
            isOpen.value = false;
        });

    notify({
        title: 'Added Collection',
        text: `Added new Collection ${collectionName.value}`,
        type: 'success',
    });
}
</script>
<style lang="scss" scoped>
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
