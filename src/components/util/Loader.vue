<template>
    <svg width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({ components: { } })
export default class LoaderVue extends Vue {}
</script>
<style lang="scss" scoped>
@use "sass:math";
$offset: 187;
$duration: 1.4s;
$timeout: .5s;
svg {
    opacity: 0;
    animation:
        rotator $duration linear infinite $timeout,
        showFromHidden $timeout forwards;
}
circle {
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke: #D18F1F;
    animation: dash $duration ease-in-out infinite;
}
// show loader only after a timeout, to prevent it from
// flasing on short loading times
@keyframes showFromHidden {
    99% { opacity: 0; }
    100% { opacity: 1; }
}
@keyframes rotator {
    to { transform: rotate(270deg); }
}
@keyframes dash {
    0% {
        stroke-dashoffset: $offset;
    }
    50% {
        stroke-dashoffset: math.div($offset, 4);
        transform: rotate(135deg);
    }
    100% {
        stroke-dashoffset: $offset;
        transform: rotate(450deg);
    }
}
</style>
