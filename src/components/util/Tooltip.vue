<template>
    <div class="grad-tooltip">
        <slot />
        <span v-if="text.length > 0" ref="tooltip" class="grad-tooltip__text" role="tooltip" v-html="text"></span>
    </div>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import { Options, Vue } from 'vue-class-component';
@Options({})
export default class TooltipVue extends Vue {
    @Prop({ default: '' }) private text!: string;
    /**
     * @description Adjusts position of tooltip to make sure it doesn't clip over the left side of the screen
     * @author DerZade
     */
    public mounted (): void {
        // TODO: Clipping is only calculated on first render. Window resize is not considered
        const tooltip = this.$refs.tooltip as HTMLSpanElement;
        if (!tooltip) return;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { x: parentX } = tooltip.parentElement!.getBoundingClientRect();
        const left = parentX + tooltip.offsetLeft;
        const right = left + tooltip.offsetWidth;
        if (left < 8) {
            tooltip.style.top = 'initial';
            tooltip.style.left = 'calc(100% + .25rem)';
            tooltip.style.transformOrigin = 'center left';
            return;
        }
        if (right > window.innerWidth - 8) {
            tooltip.style.top = 'initial';
            tooltip.style.right = 'calc(100% + .25rem)';
            tooltip.style.transformOrigin = 'center right';
        }
    }
}
</script>

<style lang="scss" scoped>
.grad-tooltip {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    &__text {
        visibility: hidden;
        font-family: 'Source Sans Pro', sans-serif;
        text-transform: none;
        color: rgba(255,255,255,0);
        white-space: nowrap;
        background-color: rgba(black, 0);
        border-radius: .25rem;
        position: absolute;
        letter-spacing: 0.04em;
        z-index: 2;
        padding: .25rem .5rem;
        line-height: 0.9rem;
        font-size: 0.9rem;
        transition: transform .15s ease-out;
        transform-origin: bottom center;
        pointer-events: none;
        transform: scale(0.9);
        font-weight: 500;
        top: -1.65rem;
    }
    &:hover #{&}__text {
        color: rgba(255,255,255,1);
        transform: scale(1);
        background-color: rgba(black, 0.85);
    }
    &:hover > &__text,
    &:focus > &__text,
    &:focus-within > &__text {
        visibility: visible;
    }
}
</style>
