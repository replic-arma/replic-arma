<template>
  <div class="collections">
    <ul class="collections__list">
      <repo v-for="(repo, i) of repos" :key="i" :repository="repo" :repositoryIndex="repo.id"></repo>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RepoVue from '@/components/Repository.vue';
import { useRepoStore } from '../store/repo';
import { ReplicArmaRepository } from '@/models/Repository';
import { useDialogStore } from '@/store/dialog';
import Toast from '@/components/util/Toast';

@Options({
    components: {
        Repo: RepoVue
    }
})
export default class CollectionsList extends Vue {
  private repoStore = useRepoStore();
  private repos: ReplicArmaRepository[] = [];
  private dialogStore = useDialogStore();

  public created (): void {
      this.repos = this.repoStore.getRepos;
  }
}
</script>

<style lang="scss" scoped>
.collections {
  &__list {
    padding: 0;
    display: grid;
    gap: var(--space-sm);
  }
}
</style>
