<template>
    <replic-dialog :dialogName="'downloads'">
      <template v-slot:header>
        <mdicon role="button" name="close" @click="dialogStore.toggleDialog('downloads')" size="40" />
        <h1>Downloads</h1>
        <download-progress v-model:speeds="speedOverTime" />
      </template>
      <template v-slot:main >
        <ul class="download-items">
          <download-item v-for="(item, i) of downloadItems" :key="i" :downloadItem="item"></download-item>
        </ul>
        <span class="download-sub-head">{{$t('download-status.queued')}}<span class="download-sub-head__count">({{queueItems.length}})</span></span>
        <ul class="download-items">
          <download-item v-for="(item, i) of queueItems" :key="i" :downloadItem="item"></download-item>
        </ul>
        <span class="download-sub-head" v-if="updateNeededItems.length">{{$t('download-status.outdated')}}<span class="download-sub-head__count">({{updateNeededItems.length}})</span></span>
        <ul class="download-items" v-if="updateNeededItems.length">
          <download-item v-for="(item, i) of updateNeededItems" :key="i" :downloadItem="item"></download-item>
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
    private queueItems: DownloadItem[] = [];
    private updateNeededItems: DownloadItem[] = [];
    private speedOverTime: number[] = [];
    private storeSubscription: (() => void)|undefined;
    private toggleDialog = () => { this.dialogStore.toggleDialog('downloads'); };
    public created (): void {
        this.downloadItems = this.downloadStore.getDownloads ?? [];
        this.queueItems = this.downloadStore.getQueue ?? [];
        this.updateNeededItems = this.downloadStore.getUpdateNeeded ?? [];
        this.storeSubscription = this.downloadStore.$subscribe(() => {
            this.downloadItems = this.downloadStore.getDownloads ?? [];
            this.queueItems = this.downloadStore.getQueue ?? [];
            this.updateNeededItems = this.downloadStore.getUpdateNeeded ?? [];
        });

        window.setInterval(() => {
            this.speedOverTime.push(Math.round(Math.random() * 1000));
        }, 2000);
    }

    public unmounted (): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.storeSubscription = () => { };
    }
}
</script>
<style lang="scss" scoped>
.download-items {
    display: grid;
    gap: var(--space-sm);
    padding-inline-start: 0;
}
.download-sub-head {
    font-size: 16pt;
    position: relative;
    width: 100%;
    display: inline-block;
    &__count {
      margin-inline-start: .5rem;
      color: var(--c-text-3);
    }
    &::after {
      content: '';
      top: 50%;
      position: absolute;
      height: 2px;
      background: grey;
      width: fill-available;
      margin-inline-start: .5rem;
    }
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
    grid-template-columns: 4rem 18rem auto;
    border-bottom: 1px solid black;
    align-items: center;
    font-size: 20pt;
    span {
        cursor: pointer;
    }
  }
}
</style>
