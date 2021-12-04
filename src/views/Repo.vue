<template>
  <div class="repo-view">
    <div class="repo-view__heading">
      <router-link to="/"><mdicon name="chevron-left" size="45"/></router-link>
      <h1>{{repository.name}}</h1>
      <div class="icon-group">
        <router-link to="/settings/general"><mdicon name="download" size="35"/></router-link>
        <router-link to="/settings/general"><mdicon name="cog" size="35"/></router-link>
      </div>
    </div>
    <subnavi :subnaviItems="subnaviItems"></subnavi>
    <router-view />
  </div>
</template>

<script lang="ts">
import SubnaviVue, { SubnaviItem } from '@/components/Subnavi.vue';
import { ReplicArmaRepository } from '@/models/Repository';
import { Options, Vue } from 'vue-class-component';
import { useRepoStore } from '../store/repo';
@Options({
    components: {
        Subnavi: SubnaviVue
    }
})
export default class RepoView extends Vue {
  private repository!: ReplicArmaRepository;
  private repositoryIndex!: number;
  private subnaviItems: SubnaviItem[] = [];
  private repoStore = useRepoStore();

  public created () {
      this.repositoryIndex = +this.$router.currentRoute.value.params.id;
      this.subnaviItems = [
          { label: 'Modset', link: '/repo/' + this.repositoryIndex + '/modsets' },
          { label: 'Server', link: '/repo/' + this.repositoryIndex + '/servers' }
      ];
      this.repository = this.repoStore.getRepo(this.repositoryIndex);
  }
}
</script>

<style lang="scss" scoped>
.repo-view {

  &__heading {
    display: grid;
    grid-template-columns: 3rem 1fr auto auto;
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
      grid-template-columns: repeat(2, 3rem);
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
