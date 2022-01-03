<template>
  <div class="repo-view">
    <div class="repo-view__heading">
      <router-link to="/"><mdicon name="chevron-left" size="55"/></router-link>
      <h1>{{repository.name}}</h1>
      <div class="icon-group">
        <router-link :to="'/reposettings/'+ repositoryIndex"><mdicon  name="cog" size="55"/></router-link>
      </div>
    </div>
    <subnavi :subnaviItems="subnaviItems"></subnavi>
    <router-view />
  </div>
</template>

<script lang="ts">
import SubnaviVue, { SubnaviItem } from '@/components/util/Subnavi.vue';
import { ReplicArmaRepository } from '@/models/Repository';
import { Options, Vue } from 'vue-class-component';
import { useRepoStore } from '../store/repo';
import { useDialogStore } from '../store/dialog';
@Options({
    components: {
        Subnavi: SubnaviVue
    }
})
export default class RepoView extends Vue {
  private repository!: ReplicArmaRepository|undefined;
  private repositoryIndex!: string;
  private subnaviItems: SubnaviItem[] = [];
  private repoStore = useRepoStore();
  private dialogStore = useDialogStore();
  private toggleDialog = () => { this.dialogStore.toggleDialog('repoSettings'); };

  public created ():void {
      this.repositoryIndex = this.$router.currentRoute.value.params.id as string;
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
  position: relative;
  &__heading {
    display: grid;
    grid-template-columns: 4rem 1fr auto auto;
    font-size: 22pt;
    align-items: center;
    justify-content: center;
    h1 {
      margin: 0;
      font-style: normal;
      font-weight: bold;
    }
    .icon-group {
      display: grid;
      grid-template-columns: 3rem;
      align-items: center;
      justify-content: center;
      color: var(--c-text-3);
    }
  }
}
</style>
