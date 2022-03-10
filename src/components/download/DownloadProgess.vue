<template>
    <div class="download-progress">
        <div class="download-progress__graph" :style="`--speed-max: ${displayedMax};`">
            <div v-for="(s, i) in displayedSpeeds" :key="i" :style="`--speed: ${s};`"></div>
        </div>
        <span>Current <span class="download-progress__unit">{{formatSpeed(stats.cur)}}</span></span>
        <span>Peak <span class="download-progress__unit">{{formatSpeed(stats.max)}}</span></span>
        <span>Average <span class="download-progress__unit">{{formatSpeed(stats.avg)}}</span></span>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
@Options({
    components: { }
})
export default class DownloadProgressVue extends Vue {
    private speeds: number[] = [];

    private displayedSpeeds: number[] = [];

    private displayedMax = 10;

    private stats = {
        avg: 0,
        max: 0,
        cur: 0
    };

    @Watch('speeds', { deep: true })
    private recalculate (): void {
        this.displayedSpeeds = this.speeds.slice(-100);
        this.displayedMax = Math.max(...this.displayedSpeeds);

        if (this.speeds.length % 5 === 0) {
            this.stats = {
                cur: this.speeds[this.speeds.length - 1],
                max: Math.max(...this.speeds),
                avg: Math.floor(this.speeds.reduce((prev, cur) => prev + cur, 0) / this.speeds.length)
            };
        }

        // TODO: Remove invisble speeds
    }

    private formatSpeed (speed: number): string {
        return `${speed} B/s`;
    }
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
    padding-block-end: .5rem;

    &__graph {
        grid-area: canvas;
        width: 100%;
        height: 100%;
        mask: linear-gradient( to left, rgb(0, 0, 0), rgba(0,0,0,0) 95%);
        display: flex;
        gap: .25rem;
        overflow: hidden;
        justify-content: flex-end;

        > * {
            flex-shrink: 0;
            inline-size: .5rem;
            background: #2F80ED;
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
