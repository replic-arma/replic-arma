<template>
    <div class="download-progress">
        <canvas></canvas>
        <span>Current <span class="download-progress__unit">0 B/s </span></span>
        <span>Peak <span class="download-progress__unit">0 B/s </span></span>
        <span>Average <span class="download-progress__unit">0 B/s </span></span>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useDownloadStore } from '@/store/download';

@Options({
    components: { }
})
export default class DownloadProgressVue extends Vue {
    private downloadStore = useDownloadStore();
}
</script>
<style lang="scss" scoped>
.download-progress {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 8rem auto;
    grid-template-areas:
    "canvas canvas canvas"
    "current peak average";
    font-size: 13pt;
    text-align: end;
    position: relative;
    canvas {
        grid-area: canvas;
        width: 100%;
        height: 100%;
    }

    &__unit {
        font-weight: bold;
    }
}
</style>
