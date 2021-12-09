<template>
    <div class="download-progress">
        <svg xmlns="http://www.w3.org/2000/svg" id="download-graph" style="transform: rotate(180deg)">

        </svg>
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
    private svg!: HTMLElement;
    private updateInterval: number|undefined;
    public mounted (): void {
        this.svg = document.getElementById('download-graph') as HTMLElement;
        this.updateTrack();
        this.updateInterval = setInterval(() => {
            this.updateTrack();
        }, 1000);
    }

    private updateTrack () {
        this.$nextTick(() => {
            const rects = document.querySelectorAll('rect');
            for (const rect of rects) {
                const x = rect.getAttribute('x') ?? 0;
                const newX = +x + 12;
                if (newX > this.svg.clientWidth) {
                    rect.remove();
                } else {
                    rect.setAttributeNS(null, 'x', `${newX}`);
                }
            }
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttributeNS(null, 'x', `${0 + 12}`);
            rect.setAttributeNS(null, 'width', '10');
            rect.setAttributeNS(null, 'height', `${Math.round(Math.random() * 60) + 1}`);
            rect.setAttributeNS(null, 'fill', '#2F80ED');
            this.svg.appendChild(rect);
        });
    }

    public unmounted (): void {
        clearInterval(this.updateInterval);
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
    #download-graph {
        grid-area: canvas;
        width: 100%;
        height: 100%;
        mask: linear-gradient( to right, black 40%, transparent 90%);
    }

    &__unit {
        font-weight: bold;
    }
}
</style>
