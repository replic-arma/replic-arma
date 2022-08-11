<template>
    <div class="download-progress">
        <div class="download-progress__graph" :style="`--speed-max: ${displayedMax};`">
            <div v-for="(s, i) in displayedSpeeds" :key="i" :style="`--speed: ${s};`"></div>
        </div>
        <span
            >Current <span class="download-progress__unit">{{ formatSpeed(stats.cur) }}</span></span
        >
        <span
            >Peak <span class="download-progress__unit">{{ formatSpeed(stats.max) }}</span></span
        >
        <span
            >Average <span class="download-progress__unit">{{ formatSpeed(stats.avg) }}</span></span
        >
    </div>
</template>
<script lang="ts" setup>
import { useDownloadStore } from '@/store/download';
import { ref, watch } from 'vue';

const displayedSpeeds = ref([] as Array<number>);

const displayedMax = ref(10);

const stats = ref({
    avg: 0,
    max: 0,
    cur: 0,
});

watch(useDownloadStore().speeds, (currentValue) => {
    displayedSpeeds.value = currentValue.slice(-100);
    displayedMax.value = Math.max(...displayedSpeeds.value);

    if (currentValue.length % 5 === 0) {
        stats.value = {
            cur: currentValue[currentValue.length - 1] ?? 0,
            max: Math.max(...currentValue),
            avg: Math.floor(currentValue.reduce((prev, cur) => prev + cur, 0) / currentValue.length),
        };
        useDownloadStore().stats = stats.value;
    }
});

function formatSpeed(speed: number): string {
    return speed / 1000 < 1 ? `${speed} KB/s` : `${speed / 1000} MB/s`;
}
</script>
<style lang="scss" scoped>
.download-progress {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 5rem auto;
    grid-template-areas:
        'canvas canvas canvas'
        'current peak average';
    font-size: 13pt;
    text-align: end;
    position: relative;
    padding-block-end: 0.5rem;

    &__graph {
        grid-area: canvas;
        width: 100%;
        height: 100%;
        mask: linear-gradient(to left, rgb(0, 0, 0), rgba(0, 0, 0, 0) 95%);
        display: flex;
        gap: 0.25rem;
        overflow: hidden;
        justify-content: flex-end;

        > * {
            flex-shrink: 0;
            inline-size: 0.5rem;
            background: #2f80ed;
            transform-origin: bottom center;
            transform: scaleY(calc(var(--speed) / var(--speed-max, 1000)));
            will-change: transform;
        }
    }

    &__unit {
        font-weight: bold;
    }
}
</style>
