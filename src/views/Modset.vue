<template>
  <div class="modset">
    <div class="modset__heading">
      <mdicon name="chevron-left" size="55" @click="$router.back()" />
      <h1>{{ modset.name }}</h1>
      <div class="icon-group">
        <button class="button">
          <span v-if="status === 'downloading'" class="spinner spinner-spin" />
          <mdicon v-else-if="status === 'outdated'" name="download" />
          <mdicon v-else name="play" />
          {{ $t('download-status.' + status) }}
        </button>
        <!-- <mdicon @click="toggleDialog" name="cog" size="55" /> -->
      </div>
    </div>
    <ul class="modset__mods">
      <li class="modset__mod" v-for="(mod, i) of modset.mods" :key="i">
        {{ mod.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Modset } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {}
})
export default class ModsetVue extends Vue {
  private modset!: Modset | undefined;
  private modsetIndex!: string;
  private repoStore = useRepoStore();
  private downloadStore = useDownloadStore();
  private startDownload () {
      if (this.modset !== undefined) {
          this.downloadStore.addToQueue({
              status: 'queued',
              item: this.modset,
              size: 0,
              done: 0,
              total: 0
          });
      }
  }

  private get status () {
      if (this.downloadStore.getUpdateNeeded.find(downloadItem => downloadItem.item.id === this.modset?.id)) {
          return 'outdated';
      } else if (this.downloadStore.getDownloads.find(downloadItem => downloadItem.item.id === this.modset?.id)) {
          return 'downloading';
      } else if (this.downloadStore.getQueue.find(downloadItem => downloadItem.item.id === this.modset?.id)) {
          return 'queued';
      }
      return 'play';
  }

  public created (): void {
      const repositoryIndex = this.$router.currentRoute.value.params.id as string;
      this.modsetIndex = this.$router.currentRoute.value.params.mid as string;
      const repository = this.repoStore.getRepo(repositoryIndex);
      if (repository === undefined || repository?.modsets === undefined) return;
      this.modset = repository.modsets.get(this.modsetIndex);
  }
}
</script>

<style lang="scss" scoped>
.modset {
  &__heading {
    display: grid;
    grid-template-columns: 4rem 1fr auto auto;
    font-size: 22pt;
    align-items: center;
    justify-content: center;
    span {
      cursor: pointer;
    }
    h1 {
      margin: 0;
      font-weight: bold;
      color: #333333;
    }
    .icon-group {
      display: grid;
      grid-template-columns: max-content 4rem;
      align-items: center;
      justify-content: center;
      color: var(--c-text-3);
      span {
        cursor: pointer;
      }
    }
  }

  &__mods {
    display: flex;
    flex-flow: row wrap;
    list-style-type: none;
  }

  &__mod {
    background: var(--c-surf-3);
    width: fit-content;
    border-radius: 999px;
    padding-inline: var(--space-md);
    padding-block: var(--space-xs);
    margin-inline: var(--space-xs);
    margin-block: var(--space-xxs);
  }
}
// .btn {
//   background: var(--c-surf-2);
//   border-radius: 1rem;
//   color: white;
//   text-align: center;
//   block-size: var(--space-xl);
//   margin-inline-end: var(--space-md);
//   padding-inline-end: var(--space-md);
//   font-size: 18pt;
//   cursor: pointer;
//   display: grid;
//   grid-template-columns: 2rem auto;
//   column-gap: .75rem;
//   justify-content: center;
//   align-content: center;
// }
</style>
