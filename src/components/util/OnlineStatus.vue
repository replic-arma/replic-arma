<template>
    <div class="online-status">
        <div class="online-status__bubble">
            <div
                class="bubble"
                :style="`--status: ${online ? 'lightgreen' : 'red'}; --status-bg: ${online ? '0, 255, 34' : '255, 0, 0'};`"
            >
                <span class="bubble-outer-dot">
                    <span class="bubble-inner-dot"></span>
                </span>
            </div>
        </div>
        <div class="online-status__text">
            <span v-if="online">Online</span>
            <span v-else>Offline</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useOnline } from '@vueuse/core';

const online = useOnline();
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
