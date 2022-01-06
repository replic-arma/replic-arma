<template>
  <div class="repos">
    <div class="repos__heading">
      <h1>{{$t('repositories')}}</h1>
      <div class="icon-group">
        <mdicon name="download" size="45" @click="toggleDialog('downloads')"/>
        <mdicon name="refresh" size="45" @click="reloadRepos"/>
        <router-link class="button" to="/settings"><mdicon name="cog" size="45"/></router-link>
      </div>
    </div>
    <ul class="repos__list">
      <repo v-for="(repo, i) of repos" :key="i" :repository="repo"></repo>
    </ul>
    <mdicon name="plus" class="add-button" role="button" @click="dialogStore.toggleDialog('repoAdd')"></mdicon>
    <downloads />
    <repo-add />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RepoVue from '@/components/Repository.vue';
import { useRepoStore } from '../store/repo';
import ReplicDialogVue from '@/components/util/ReplicDialog.vue';
import { useDialogStore } from '@/store/dialog';
import DownloadsVue from '@/components/download/Downloads.vue';
import RepositoryAddVue from '@/components/RepositoryAdd.vue';
import Toast from '@/components/util/Toast';
import { mapState } from 'pinia';

@Options({
    components: {
        Repo: RepoVue,
        ReplicDialog: ReplicDialogVue,
        Downloads: DownloadsVue,
        RepoAdd: RepositoryAddVue
    },
    computed: {
        ...mapState(useRepoStore, {
            repos: store => store.getRepos
        })
    }
})
export default class ReposView extends Vue {
  private dialogStore = useDialogStore();
  private reloadRepos = () => { Toast('Reloading Repositories'); };
}
</script>

<style lang="scss" scoped>
.repos {
  &__list {
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
      font-weight: bold;
    }

    .icon-group {
      > span {
        cursor: pointer;
      }
      color: var(--c-text-3);
      display: grid;
      grid-template-columns: repeat(3, 4rem);
      align-items: center;
      justify-content: center;
      .mdi {
        display: inline-flex;
        justify-content: center;
      }
    }
  }
}
</style>
