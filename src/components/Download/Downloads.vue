<template>
    <Tooltip text="Downloads" position="bottom">
        <mdicon name="download" role="button" size="35" @click="isOpen = true" />
    </Tooltip>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <mdicon role="button" name="close" size="45" @click="isOpen = false" />
                <h1 v-t="'downloads'"></h1>
                <DownloadProgess />
            </div>
            <ul class="download-items">
                <DownloadItemVue v-if="downloadItem !== null" :downloadItem="downloadItem" />
            </ul>
            <div class="download-sub-head" v-if="queueItems.length > 0">
                <span v-t="'status.queued'"></span>
                <div class="download-sub-head__wrapper">
                    <span class="download-sub-head__count">({{ queueItems.length }})</span>
                    <span class="download-sub-head__line"></span>
                </div>
            </div>
            <ul class="download-items">
                <DownloadItemVue v-for="(item, i) of queueItems" :key="i" :downloadItem="item" />
            </ul>
            <div class="download-sub-head" v-if="finishedItems.length > 0">
                <span v-t="'status.finished'"></span>
                <div class="download-sub-head__wrapper">
                    <span class="download-sub-head__count">({{ finishedItems.length }})</span>
                    <span class="download-sub-head__line"></span>
                </div>
            </div>
            <ul class="download-items">
                <DownloadItemVue v-for="(item, i) of finishedItems" :key="i" :downloadItem="item" />
            </ul>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import DownloadItemVue from './DownloadItem.vue';
import DownloadProgess from './DownloadProgess.vue';
import { computed, ref } from 'vue';
import { useDownloadStore } from '@/store/download';

const downloadItem = computed(() => useDownloadStore().current);
const queueItems = computed(() => useDownloadStore().queue);
const finishedItems = computed(() => useDownloadStore().finished);
const isOpen = ref(false);
</script>
<style lang="scss" scoped>
.download-items {
    display: grid;
    gap: 1rem;
    padding-inline-start: 0;
}
.download-sub-head {
    font-size: 16pt;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    &__wrapper {
        display: flex;
        width: 100%;
    }
    &__count {
        color: var(--c-text-3);
    }
    &__line {
        margin-inline-start: 1rem;
        width: 100%;
        height: 2px;
        background: grey;
        margin-top: auto;
        margin-bottom: auto;
    }
}

.replic-dialog {
    top: 0;
    height: fit-content;
    &::after {
        border-bottom-left-radius: 2rem;
        border-bottom-right-radius: 2rem;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
    &__heading {
        display: grid;
        font-weight: 600;
        grid-template-columns: 4rem 18rem auto;
        border-bottom: 1px solid black;
        align-items: center;
        font-size: 14pt;
        span {
            cursor: pointer;
        }
    }
}
</style>
