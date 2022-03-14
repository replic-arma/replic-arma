<template>
    <replic-dialog :dialogName="'collectionAdd'">
        <template v-slot:header>
            <span>{{ $t('collection.add') }}</span>
            <mdicon role="button" @click="dialogStore.toggleDialog('collectionAdd')" name="close" size="35" />
        </template>
        <template v-slot:main>
            <div class="txt">
                <label for="collectionName">{{ $t('collection.name') }}</label>
                <div class="txt__input-wrapper">
                    <input class="txt__input" type="text" name="collectionName" v-model="collectionName" />
                </div>
            </div>
            <button class="button" @click="addCollection">{{ $t('collection.add') }}</button>
        </template>
    </replic-dialog>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
import { useDialogStore } from '@/store/dialog';
import { useRepoStore } from '@/store/repo';
import { v4 as uuidv4 } from 'uuid';
import Toast from './util/Toast';
@Options({
    components: {
        ReplicDialog: ReplicDialogVue,
    },
})
export default class CollectionAddVue extends Vue {
    private dialogStore = useDialogStore();
    private collectionName: string | null = null;
    private addCollection() {
        const repoStore = useRepoStore();
        if (this.collectionName === null) return;
        repoStore.addCollectionToRepo(repoStore.currentRepoId, {
            id: uuidv4(),
            name: this.collectionName,
        });
        this.dialogStore.toggleDialog('collectionAdd');
        Toast('Added Collection');
    }
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &:deep(&__heading) {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &:deep(&__content) {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
