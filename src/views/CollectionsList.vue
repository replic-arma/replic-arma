<template>
  <div class="collections">
    <ul class="collections__list">
      <collection-item v-for="(collection, i) of collections" :key="i" :collection="collection"></collection-item>
    </ul>
    <mdicon name="plus" class="add-button" role="button" @click="dialogStore.toggleDialog('collectionAdd')"></mdicon>
    <collection-add />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useRepoStore } from '../store/repo';
import { Collection } from '@/models/Repository';
import { useDialogStore } from '@/store/dialog';
import CollectionItemVue from '@/components/CollectionItem.vue';
import { mapState } from 'pinia';
import CollectionAddVue from '@/components/CollectionAdd.vue';

@Options({
    components: {
        CollectionItem: CollectionItemVue,
        CollectionAdd: CollectionAddVue
    },
    computed: {
        ...mapState(useRepoStore, {
            collections: store => store.getCollections(useRepoStore().currentRepoId)
        })
    }
})
export default class CollectionsList extends Vue {
  private repoStore = useRepoStore();
  private dialogStore = useDialogStore();
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
