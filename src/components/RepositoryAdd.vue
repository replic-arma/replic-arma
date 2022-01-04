<template>
    <replic-dialog :dialogName="'repoAdd'">
        <template v-slot:header>
            <span>Add Repo</span>
            <mdicon role="button" @click="dialogStore.toggleDialog('repoAdd')" name="close" size="35" />
        </template>
        <template v-slot:main>
            <div class="txt">
                <label for="repoName">{{$t('repository.autoconfig')}}</label>
                <div class="txt__input-wrapper">
                    <input class="txt__input" type="text" name="repoName" />
                </div>
            </div>
            <div class="txt">
                <label for="repoName">{{$t('repository.name')}}</label>
                <div class="txt__input-wrapper">
                    <input class="txt__input" type="text" name="repoName" />
                </div>
            </div>
            <button class="button" @click="addRepo">Add Repository</button>
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
        ReplicDialog: ReplicDialogVue
    }
})
export default class RepositoryAddVue extends Vue {
    private dialogStore = useDialogStore();
    private toggleDialog = () => { this.dialogStore.toggleDialog('repoAdd'); };
    private addRepo () {
        const repoStore = useRepoStore();
        repoStore.addRepo(
            {
                id: uuidv4(),
                build_date: '12.11',
                name: 'Saturday Skirmish',
                open_repository_schema: 1,
                type: 'local',
                modsets: new Map().set(uuidv4(), { id: uuidv4(), name: 'All Mods', description: 'All Mods from the Repository' })
            }
        );
        this.toggleDialog();
        Toast('Added Repository');
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
