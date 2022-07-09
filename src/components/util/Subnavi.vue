<template>
    <ul class="subnavi">
        <li class="subnavi__item" v-for="(item, i) of subnaviItems" :key="i">
            <router-link class="button" :to="item.link" v-t="item.label"></router-link>
        </li>
    </ul>
</template>
<script lang="ts" setup>
import { nextTick, watch } from '@vue/runtime-core';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

export interface SubnaviItem {
    label: string;
    link: string;
}
const props = defineProps({
    subnaviItems: {
        type: Array,
        default: null,
    },
});
watch(useRoute(), () => {
    nextTick(() => routeChanged());
});

onMounted(() => {
    routeChanged();
});

function routeChanged() {
    const anchor = document.querySelector('.router-link-active') as HTMLAnchorElement;
    if (anchor === null) return;
    const el = anchor.parentElement as HTMLLIElement;

    const bb = el.getBoundingClientRect();
    const parentBB = el.parentElement!.getBoundingClientRect();
    const left = bb.left - parentBB.left;
    const width = bb.width;
    (el.parentElement as HTMLUListElement).style.setProperty('--subnavi-left', `${left}px`);
    (el.parentElement as HTMLUListElement).style.setProperty('--subnavi-width', `${width}px`);
}
</script>
<style lang="scss" scoped>
.subnavi {
    list-style-type: none;
    border-bottom: 1px solid #333333;
    display: flex;
    gap: 0.5rem;
    padding-block-end: var(--space-md);
    padding-inline-start: 0;
    position: relative;
    user-select: text;

    &__item {
        z-index: 1;

        > a {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 16pt;
            color: var(--c-text-1);
            padding-inline: 1rem;
            height: 1.5rem;
            block-size: 3.25rem;
            border-radius: 0.25rem;
        }
    }

    &::before {
        block-size: 3.25rem;
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: var(--subnavi-left, 0);
        inline-size: var(--subnavi-width, 0px);
        background: var(--c-surf-3);
        border-radius: 1rem;
        z-index: 0;
        transition: all 0.07s ease-out;
    }
}
a:not(.router-link-active) {
    color: var(--c-text-3);
}
</style>
