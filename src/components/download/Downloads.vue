<template>
    <mdicon name="download" size="45" @click="isOpen = true" />
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <mdicon
                    role="button"
                    name="close"
                    size="40"
                    @click="isOpen = false"
                />
                <h1>Downloads</h1>
                <download-progress />
            </div>

            <ul class="download-items">
                <download-item
                    v-if="downloadItem !== null"
                    :downloadItem="downloadItem"
                ></download-item>
            </ul>
            <span class="download-sub-head"
                >{{ $t('download-status.queued')
                }}<span class="download-sub-head__count"
                    >({{ queueItems.length }})</span
                ></span
            >
            <ul class="download-items">
                <download-item
                    v-for="(item, i) of queueItems"
                    :key="i"
                    :downloadItem="item"
                ></download-item>
            </ul>
            <span class="download-sub-head" v-if="updateNeededItems.length > 0"
                >{{ $t('download-status.outdated')
                }}<span class="download-sub-head__count"
                    >({{ updateNeededItems.length }})</span
                ></span
            >
            <ul class="download-items" v-if="updateNeededItems.length > 0">
                <download-item
                    v-for="(item, i) of updateNeededItems"
                    :key="i"
                    :downloadItem="item"
                ></download-item>
            </ul>
        </div>
    </Teleport>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from '../util/ReplicDialog.vue';
import { useDownloadStore } from '@/store/download';
import DownloadProgressVue from './DownloadProgess.vue';
import DownloadItemVue from './DownloadItem.vue';
import { DownloadItem } from '@/models/Download';
import { toRaw } from 'vue';

@Options({
    components: {
        ReplicDialog: ReplicDialogVue,
        DownloadProgress: DownloadProgressVue,
        DownloadItem: DownloadItemVue
    }
})
export default class DownloadsVue extends Vue {
    private downloadStore = useDownloadStore();
    private downloadItem: DownloadItem | null = null;
    private queueItems: DownloadItem[] = [];
    private updateNeededItems: DownloadItem[] = [];
    private speedOverTime: number[] = [];
    private storeSubscription: (() => void) | undefined;
    private isOpen = false;

    public created (): void {
        this.queueItems = [];
        this.updateNeededItems = [];
        this.storeSubscription = this.downloadStore.$subscribe(() => {
            this.downloadItem = toRaw(
                this.downloadStore.current as DownloadItem
            );
            this.queueItems = toRaw(
                Array.from(this.downloadStore.queue.values())
            );
            this.updateNeededItems = [];
        });
    }
}
</script>
<style lang="scss" scoped>
span {
    cursor: pointer;
    justify-content: center;
}
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
        margin-inline-start: 0.5rem;
        color: var(--c-text-3);
    }
    &::after {
        content: '';
        top: 50%;
        position: absolute;
        height: 2px;
        background: grey;
        width: stretch;
        margin-inline-start: 0.5rem;
    }
}

.replic-dialog {
    top: 0;
    margin: 0;
    height: fit-content;
    &::after {
        border-bottom-left-radius: 2rem;
        border-bottom-right-radius: 2rem;
    }
    &__heading {
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
