<template></template>

<script lang="ts" setup>
import { notify } from '@kyvg/vue3-notification';
import { useOnline } from '@vueuse/core';
import { watch } from 'vue';

const online = useOnline();
watch(online, () => {
    if (online.value) return;
    notify({
        title: 'You are offline',
        text: 'bla',
        type: 'error',
        duration: -1
    });
});
</script>
<style lang="scss" scoped>
.online-status {
    display: flex;
    &__text {
        margin-inline-start: 1rem;
    }
}

.bubble {
    display: block;
    position: absolute;
    cursor: pointer;
}

.bubble:hover:after {
    background-color: var(--status);
}

.bubble:after {
    content: '';
    background-color: var(--status);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    position: absolute;
    display: block;
    top: 1px;
    left: 1px;
}

.bubble .bubble-outer-dot {
    margin: 1px;
    display: block;
    text-align: center;
    opacity: 1;
    background-color: rgba(var(--status-bg), 0.4);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    -webkit-animation: bubble-pulse 1.5s linear infinite;
    -moz-animation: bubble-pulse 1.5s linear infinite;
    -o-animation: bubble-pulse 1.5s linear infinite;
    animation: bubble-pulse 1.5s linear infinite;
}

.bubble .bubble-inner-dot {
    display: block;
    text-align: center;
    opacity: 1;
    background-color: rgba(var(--status-bg), 0.4);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    -webkit-animation: bubble-pulse 1.5s linear infinite;
    -moz-animation: bubble-pulse 1.5s linear infinite;
    -o-animation: bubble-pulse 1.5s linear infinite;
    animation: bubble-pulse 1.5s linear infinite;
}

.bubble .bubble-inner-dot:after {
    content: '';
    display: block;
    text-align: center;
    opacity: 1;
    background-color: rgba(var(--status-bg), 0.4);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    -webkit-animation: bubble-pulse 1.5s linear infinite;
    -moz-animation: bubble-pulse 1.5s linear infinite;
    -o-animation: bubble-pulse 1.5s linear infinite;
    animation: bubble-pulse 1.5s linear infinite;
}

@-webkit-keyframes bubble-pulse {
    0% {
        transform: scale(1);
        opacity: 0.75;
    }
    25% {
        transform: scale(1);
        opacity: 0.75;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}

@keyframes bubble-pulse {
    0% {
        transform: scale(1);
        opacity: 0.75;
    }
    25% {
        transform: scale(1);
        opacity: 0.75;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}

@-moz-keyframes bubble-pulse {
    0% {
        transform: scale(1);
        opacity: 0.75;
    }
    25% {
        transform: scale(1);
        opacity: 0.75;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}

@-o-keyframes bubble-pulse {
    0% {
        transform: scale(1);
        opacity: 0.75;
    }
    25% {
        transform: scale(1);
        opacity: 0.75;
    }
    100% {
        transform: scale(2.5);
        opacity: 0;
    }
}
</style>
