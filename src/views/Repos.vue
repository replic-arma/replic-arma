<template>
  <div class="repos">
    <div class="repos__heading">
      <h1>Repos</h1>
      <div class="icon-group">
        <router-link to="/settings"><mdicon name="download" size="35"/></router-link>
        <mdicon name="refresh" size="35"/>
        <router-link to="/settings/general"><mdicon name="cog" size="35"/></router-link>
      </div>
    </div>
    <ul>
      <repo v-for="(repo, i) of repos" :key="i" :repository="repo" :repositoryIndex="i"></repo>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RepoVue from '@/components/Repo.vue';
import { useRepoStore } from '../store/repo';
import { ReplicArmaRepository } from '@/models/Repository';
@Options({
    components: {
        Repo: RepoVue
    }
})
export default class ReposView extends Vue {
  private repoStore = useRepoStore();
  private repos: ReplicArmaRepository[] = [];
  public mounted (): void {
      this.repos = this.repoStore.getRepos;
  }
}
</script>

<style lang="scss" scoped>
.repos {
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
      display: grid;
      grid-template-columns: repeat(3, 3rem);
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
