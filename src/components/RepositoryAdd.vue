<template>
    <replic-dialog :dialogName="'repoAdd'">
        <template v-slot:header>
            <span>{{$t('repository.add')}}</span>
            <mdicon role="button" @click="dialogStore.toggleDialog('repoAdd')" name="close" size="35" />
        </template>
        <template v-slot:main>
            <div class="txt">
                <label for="repoName">{{$t('repository.autoconfig')}}</label>
                <div class="txt__input-wrapper">
                    <input class="txt__input" type="text" name="repoName" v-model="autoConfigModel" />
                </div>
            </div>
            <div class="txt">
                <label for="repoName">{{$t('repository.name')}}</label>
                <div class="txt__input-wrapper">
                    <input class="txt__input" type="text" name="repoName" />
                </div>
            </div>
            <button class="button" @click="addRepo">{{$t('submit')}}</button>
        </template>
    </replic-dialog>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
import { useDialogStore } from '@/store/dialog';
import { useRepoStore } from '@/store/repo';
import Toast from './util/Toast';
import { ReplicArmaRepository } from '@/models/Repository';
import { System } from '@/util/system';
@Options({
    components: {
        ReplicDialog: ReplicDialogVue
    }
})
export default class RepositoryAddVue extends Vue {
    private dialogStore = useDialogStore();
    private toggleDialog = () => { this.dialogStore.toggleDialog('repoAdd'); };
    private autoConfigModel = '';
    private addRepo () {
        const repoStore = useRepoStore();
        System.getRepo(this.autoConfigModel).then((repo: ReplicArmaRepository) => {
            repoStore.addRepo(
                repo
            );
            this.toggleDialog();
            Toast('Added Repository');
        }).catch(error => console.error(error));
    }
}
</script>
<style lang="scss" scoped>
.replic-dialog {
  height: fit-content;
  width: 75%;
  &::v-deep &__heading {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    font-size: 20pt;
    margin-block-end: 2rem;
    span:not(:first-child) {
        cursor: pointer;
    }
  }
  &::v-deep &__content {
      display: grid;
      row-gap: 1rem;
  }
}

</style>
