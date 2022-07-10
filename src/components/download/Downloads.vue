<template>
    <mdicon name="download" size="45" @click="isOpen = true" />
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <mdicon role="button" name="close" size="40" @click="isOpen = false" />
                <h1>Downloads</h1>
                <keep-alive>
                    <DownloadProgess />
                </keep-alive>
            </div>
            <ul class="download-items">
                <DownloadItemVue v-if="downloadItem !== null" :downloadItem="downloadItem" />
            </ul>
            <div class="download-sub-head" v-if="queueItems.length > 0">
                <span v-t="'download-status.queued'"></span>
                <span class="download-sub-head__count">({{ queueItems.length }})</span>
            </div>
            <ul class="download-items">
                <DownloadItemVue v-for="(item, i) of queueItems" :key="i" :downloadItem="item" />
            </ul>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import DownloadItemVue from './DownloadItem.vue';
import DownloadProgess from './DownloadProgess.vue';
import type { DownloadItem } from '@/models/Download';
import { computed, ref } from 'vue';
import { useDownloadStore } from '@/store/download';

const downloadItem = computed(() => useDownloadStore().current);
const queueItems = computed(() => useDownloadStore().queue);
const isOpen = ref(false);
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
