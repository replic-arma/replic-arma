<template>
    <li :class="`download-item download-item--${downloadItem.status}`">
        <img v-if="repo !== null && repo !== undefined" class="download-item__img" :src="repo.image" />
        <div class="download-item__name-wrapper">
            <span class="download-item__repo-name" v-if="repo !== null && repo !== undefined">{{ repo.name }}</span>
            <span class="download-item__name">{{ downloadItem.item.name }}</span>
        </div>
        <div v-if="downloadItem.status !== 'queued' || downloadItem.status === 'paused'" class="download-item__status">
            <span class="download-item__progress">{{ progress }}%</span>
            <span class="download-item__size">{{ received }} GB / {{ size }} GB</span>
            <div class="download-item__progress-bar" :style="`--progress: ${progress}%;`"></div>
            <span class="download-item__time" v-if="downloadItem.status !== 'paused'">~{{ remaining }} left</span>
            <span class="download-item__time" v-else>Paused</span>
        </div>
        <div v-else>
            <div class="download-item__status">
                <div class="download-item__queue-wrapper">
                    <span class="download-item__queue-label">Missing Files</span>
                    <span class="download-item__queue-value">{{ cacheData?.missingFiles.length }}</span>
                </div>
                <div class="download-item__queue-wrapper">
                    <span class="download-item__queue-label">Outdated Files</span>
                    <span class="download-item__queue-value">{{ cacheData?.outdatedFiles.length }}</span>
                </div>
                <div class="download-item__queue-wrapper">
                    <span class="download-item__queue-label">Size</span>
                    <span class="download-item__queue-value">{{ size }} GB</span>
                </div>
            </div>
        </div>
        <div class="download-item__controls">
            <template v-if="downloadItem.status === 'downloading'">
                <mdicon @click="pauseDownloadF" name="pause" />
            </template>
            <template v-else>
                <mdicon name="play" @click="startDownload()" />
            </template>
            <mdicon @click="stopDownload" name="close" />
        </div>
    </li>
</template>
<script lang="ts" setup>
import type { DownloadItem } from '@/models/Download';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { pauseDownload } from '@/util/system/download';
import { computed } from 'vue';
interface Props {
    downloadItem: DownloadItem;
}
const props = defineProps<Props>();

const progress = computed(() => {
    if (useDownloadStore().current === null) return 0;
    return Number(
        (useDownloadStore().current!.received / 10e5 / (useDownloadStore().current!.size / 10e8)) * 100
    ).toFixed(0);
});

const size = computed(() => {
    if (props.downloadItem === null) return 0;
    return Number(props.downloadItem.size / 10e8).toFixed(2);
});

const received = computed(() => {
    if (useDownloadStore().current == null) return 0;
    return Number(useDownloadStore().current!.received / 10e5).toFixed(2);
});

const remaining = computed(() => {
    if (useDownloadStore().current === null || useDownloadStore().stats == null) return 0;
    const time =
        (useDownloadStore().current!.size / 1000 - useDownloadStore().current!.received) /
        useDownloadStore().stats!.avg;
    const minutes = Math.floor(time / 60);
    const seconds = Number(time - minutes * 60).toFixed(0);
    return `${minutes} Minutes ${seconds} Seconds`;
});

const repo = computed(() => {
    if (props.downloadItem === null) return null;
    const repo = useRepoStore().repos?.find((repo) => repo.id === props.downloadItem.repoId);
    return repo;
});

const cacheData = computed(() => {
    if (props.downloadItem === null) return null;
    const cacheData = useHashStore().cache.find((cacheItem) => cacheItem.id === props.downloadItem.item.id);
    if (cacheData === undefined) return null;
    return cacheData;
});

function startDownload() {
    if (props.downloadItem.status === 'paused' || props.downloadItem.status === 'queued') {
        useDownloadStore().next();
    }
}

async function stopDownload() {
    if (props.downloadItem.item.id === useDownloadStore().current?.item.id) {
        useDownloadStore().current = null;
        await pauseDownload();
    } else {
        useDownloadStore().queue =
            useDownloadStore().queue.filter(
                (downloadItem: DownloadItem) => downloadItem.item.id !== props.downloadItem.item.id
            ) ?? [];
    }
}

async function pauseDownloadF() {
    useDownloadStore().current!.status = 'paused';
    await pauseDownload();
}
</script>
<style lang="scss" scoped>
.download-item {
    height: 5rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 4rem minmax(15ch, 15rem) 1fr 10%;
    padding-inline-start: var(--space-sm);
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 1rem;
    overflow: hidden;

    &#{&}--downloading,
    &#{&}--paused {
        .download-item__status {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1rem 1rem 1rem;
            grid-template-areas:
                'percent . data'
                'canvas canvas canvas'
                'time time time';
        }
    }

    &#{&}--queued {
        .download-item__status {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
        }
    }
    &__queue-wrapper {
        display: flex;
        flex-direction: column;
    }
    &__queue-value {
        color: black;
        font-weight: bolder;
        line-height: 0.5;
    }
    &__img {
        block-size: var(--space-xl);
    }
    &__name-wrapper {
        display: flex;
        flex-direction: column;
    }
    &__repo-name {
        font-weight: bold;
        font-size: 11pt;
        opacity: 50%;
        line-height: 0.3;
    }
    &__name {
        font-weight: bold;
        font-size: 14pt;
    }
    &__controls {
        display: flex;
        justify-content: flex-end;
        padding-inline-end: var(--space-md);

        span:first-of-type {
            border-top-left-radius: var(--space-xs);
            border-bottom-left-radius: var(--space-xs);
        }

        span:last-of-type {
            border-top-right-radius: var(--space-xs);
            border-bottom-right-radius: var(--space-xs);
        }

        span {
            background: var(--c-surf-2);
            block-size: var(--space-lg);
            inline-size: var(--space-lg);
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            cursor: pointer;
        }
    }
    &__progress {
        grid-area: percent;
        color: var(--c-surf-2);
    }

    &__size {
        grid-area: data;
        text-align: end;
    }

    &__progress-bar {
        grid-area: canvas;
        background: lightgrey;
        height: 0.5rem;
        margin-block-start: var(--space-xxs);
        border-radius: 1rem;
        position: relative;
        &::before {
            content: '';
            background: var(--c-surf-2);
            height: 100%;
            width: var(--progress, 0%);
            border-radius: 1rem;
            position: absolute;
        }
    }

    &__time {
        margin-block-start: -0.25rem;
        grid-area: time;
    }

    &__status {
        padding-inline-end: var(--space-xs);
        color: grey;
    }
}
</style>
