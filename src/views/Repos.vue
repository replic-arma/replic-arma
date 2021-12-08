<template>
  <div class="repos">
    <div class="repos__heading">
      <h1>{{$t('repositories')}}</h1>
      <div class="icon-group">
        <mdicon name="download" size="35" @click="toggleDialog('downloads')"/>
        <mdicon name="refresh" size="35"/>
        <router-link to="/settings"><mdicon name="cog" size="35"/></router-link>
      </div>
    </div>
    <ul>
      <repo v-for="(repo, i) of repos" :key="i" :repository="repo" :repositoryIndex="i"></repo>
    </ul>
    <mdicon name="plus" class="repos__add" role="button" @click="toggleDialog('repoAdd')"></mdicon>
    <downloads />
    <repo-add />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RepoVue from '@/components/Repository.vue';
import { useRepoStore } from '../store/repo';
import { ReplicArmaRepository } from '@/models/Repository';
import ReplicDialogVue from '@/components/util/ReplicDialog.vue';
import { useDialogStore } from '@/store/dialog';
import DownloadsVue from '@/components/download/Downloads.vue';
import RepositoryAddVue from '@/components/RepositoryAdd.vue';

@Options({
    components: {
        Repo: RepoVue,
        ReplicDialog: ReplicDialogVue,
        Downloads: DownloadsVue,
        RepoAdd: RepositoryAddVue
    }
})
export default class ReposView extends Vue {
  private repoStore = useRepoStore();
  private repos: ReplicArmaRepository[] = [];
  private dialogStore = useDialogStore();
  private toggleDialog = (dialogName: string) => { this.dialogStore.toggleDialog(dialogName); };

  public mounted (): void {
      this.repos = this.repoStore.getRepos;
  }
}
</script>

<style lang="scss" scoped>
.repos {
  ul {
    padding: 0;
    display: grid;
    gap: var(--space-sm);
  }
  display: grid;
  &__heading {
    display: grid;
    grid-template-columns: 1fr auto auto;
    font-weight: bold;
    font-size: 22pt;
    align-items: center;
    justify-content: center;

    h1 {
      margin: 0;
      font-style: normal;
      font-weight: bold;
      color: #333333
    }
    .icon-group {
      > span {
        cursor: pointer;
      }
      display: grid;
      grid-template-columns: repeat(3, 3rem);
      align-items: center;
      justify-content: center;
    }
  }

  &__add {
    display: grid;
    background: var(--c-surf-3);
    border-radius: 2rem;
    inline-size: var(--space-xl);
    block-size: var(--space-xl);
    place-self: center center;
    justify-content: center;
    align-content: center;
    cursor: pointer;
    color: var(--c-text-2);
  }
}
</style>
