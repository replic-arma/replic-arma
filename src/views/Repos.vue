<template>
  <div class="repos">
    <div class="repos__heading">
      <h1>{{$t('repositories')}}</h1>
      <div class="icon-group">
        <mdicon name="download" size="35" @click="toggleDialog"/>
        <mdicon name="refresh" size="35"/>
        <router-link to="/settings/general"><mdicon name="cog" size="35"/></router-link>
      </div>
    </div>
    <ul>
      <repo v-for="(repo, i) of repos" :key="i" :repository="repo" :repositoryIndex="i"></repo>
    </ul>
    <button class="repos__add">Add Repository</button>
    <downloads />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RepoVue from '@/components/Repo.vue';
import { useRepoStore } from '../store/repo';
import { ReplicArmaRepository } from '@/models/Repository';
import ReplicDialogVue from '@/components/util/ReplicDialog.vue';
import { useDialogStore } from '@/store/dialog';
import DownloadsVue from '@/components/download/Downloads.vue';

@Options({
    components: {
        Repo: RepoVue,
        ReplicDialog: ReplicDialogVue,
        Downloads: DownloadsVue
    }
})
export default class ReposView extends Vue {
  private repoStore = useRepoStore();
  private repos: ReplicArmaRepository[] = [];
  private dialogStore = useDialogStore();
  private toggleDialog = () => { this.dialogStore.toggleDialog(); };

  public mounted (): void {
      this.repos = this.repoStore.getRepos;
  }
}
</script>

<style lang="scss">
.repos {
  display: flex;
  flex-direction: column;
  ul {
    padding: 0;
  }

  li {
    margin-bottom: 1rem;
  }

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
    justify-self: center;
    align-self: center;
    background: var(--c-surf-3);
    border-radius: 9rem;
    padding: .75rem 1rem;
    cursor: pointer;
    color: var(--c-text-2);
  }
}
</style>
