<template>
    <replic-dialog :dialogName="'downloads'">
      <template v-slot:header>
        <mdicon role="button" name="close" @click="dialogStore.toggleDialog('downloads')" size="40" />
        <h1>Downloads</h1>
        <download-progress />
      </template>
      <template v-slot:main >
        <ul class="downloads">
          <download-item v-for="(item, i) of downloadItems" :key="i" :downloadItem="item"></download-item>
        </ul>
      </template>
    </replic-dialog>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from '../util/ReplicDialog.vue';
import { useDialogStore } from '@/store/dialog';
import { useDownloadStore } from '@/store/download';
import DownloadProgressVue from './DownloadProgess.vue';
import DownloadItemVue from './DownloadItem.vue';
import { DownloadItem } from '@/models/Download';

@Options({
    components: {
        ReplicDialog: ReplicDialogVue,
        DownloadProgress: DownloadProgressVue,
        DownloadItem: DownloadItemVue
    }
})
export default class DownloadsVue extends Vue {
    private dialogStore = useDialogStore();
    private downloadStore = useDownloadStore();
    private downloadItems: DownloadItem[] = [];
    private toggleDialog = () => { this.dialogStore.toggleDialog('downloads'); };
    public mounted (): void {
        this.downloadItems = this.downloadStore.getDownloads ?? [];
    }
}
</script>
<style lang="scss" scoped>
.downloads {
  display: grid;
  gap: var(--space-sm);
  padding-inline-start: 0;
}
.replic-dialog {
  top: 0;
  margin:0;
  height: fit-content;

  &::after {
    border-bottom-left-radius: 2rem;
    border-bottom-right-radius: 2rem;
  }
  &::v-deep &__heading {
    display: grid;
    grid-template-columns: 3rem 18rem auto;
    border-bottom: 1px solid black;
    align-items: center;
    font-size: 20pt;
    span {
        cursor: pointer;
    }
  }
}
</style>
