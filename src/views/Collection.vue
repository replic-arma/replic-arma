<template>
  <div class="collection">
    <div class="collection__heading"  v-if="collection !== undefined">
      <mdicon name="chevron-left" size="55" @click="$router.back()" />
      <h1>{{ collection.name }}</h1>
      <div class="icon-group">
        <button class="button">
          {{$t('save')}}
        </button>
      </div>
    </div>
    <tabs :tabItems="subnaviItems"></tabs>
  </div>
</template>

<script lang="ts">
import CollectionMods from '@/components/CollectionMods.vue';
import LaunchVue from '@/components/settings/Launch.vue';
import TabsVue, { TabsItem } from '@/components/util/Tabs.vue';
import { Collection } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useRepoStore } from '@/store/repo';
import { shallowRef } from 'vue';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: { Tabs: TabsVue }
})
export default class CollectionView extends Vue {
  private collection!: Collection | undefined;
  private subnaviItems: TabsItem[] = [
      { label: 'General', component: shallowRef(CollectionMods) },
      { label: 'Launch Options', component: shallowRef(LaunchVue) }
  ];

  private repoStore = useRepoStore();
  private downloadStore = useDownloadStore();

  public created (): void {
      this.collection = this.repoStore.getCollection(this.repoStore.currentRepoId, this.repoStore.currentCollectionId);
  }
}
</script>

<style lang="scss" scoped>
.collection {
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
      .button {
        font-size: 20pt;
      }
    }
  }
}
</style>
