<template>
  <div class="modset">
    <div class="modset__heading">
      <mdicon name="chevron-left" size="55" @click="$router.back()" />
      <h1>{{ modset?.name }}</h1>
      <div class="icon-group">
        <button class="button">
          <span v-if="status === 'downloading'" class="spinner spinner-spin" />
          <mdicon v-else-if="status === 'outdated'" name="download" />
          <mdicon v-else name="play" />
          {{ $t('download-status.' + status) }}
        </button>
        <button @click="checkModset()">Check</button>
        <!-- <mdicon @click="toggleDialog" name="cog" size="55" /> -->
      </div>
    </div>
    <ul class="modset__mods">
        <li v-for="(mod, i) of modset?.mods" :key="i">
          <Tooltip :text="mod.size" style="grid-column: 1">
            <div class="modset__mod">
                {{ mod.name }} {{mod}}

            </div>
          </Tooltip>
        </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useDownloadStore } from '@/store/download';
import { useRepoStore } from '@/store/repo';
import { System } from '@/util/system';
import { mapState } from 'pinia';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
    computed: {
        ...mapState(useRepoStore, {
            modset: store => store.getModset(store.currentRepoId, store.currentModsetId)
        })
    }
})
export default class ModsetView extends Vue {
  private repoStore = useRepoStore();
  private downloadStore = useDownloadStore();
  private get status () {
      return 'play';
  }

  public checkModset () {
      System.calcModsetStatus(this.repoStore.currentRepoId, this.repoStore.currentModsetId);
  }
}
</script>

<style lang="scss" scoped>
.modset {
  &__heading {
    display: grid;
    grid-template-columns: 4rem 1fr auto;
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
      align-items: center;
      justify-content: center;
      color: var(--c-text-3);
      span {
        cursor: pointer;
      }
      .mdi {
        display: inline-flex;
        justify-content: center;
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
</style>
