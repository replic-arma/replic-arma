<template>
    <div class="settings-view">
        <div class="settings-view__heading">
            <Tooltip text="Go Back">
                <router-link class="button" to="/"><mdicon name="chevron-left" size="45" /></router-link>
            </Tooltip>
            <h1 v-t="'settings.title'"></h1>
        </div>
        <SubnaviVue :subnaviItems="subnaviItems"></SubnaviVue>
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import SubnaviVue from '@/components/util/Subnavi.vue';
import { computed } from '@vue/runtime-core';

const subnaviItems = computed(() => {
    return [
        { label: 'general', link: '/settings/general' },
        { label: 'launch_options', link: '/settings/launch' },
        { label: 'about', link: '/settings/about' }
    ];
});
</script>

<style lang="scss" scoped>
.settings-view {
    position: relative;
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto auto;
        font-size: 16pt;
        align-items: center;
        justify-content: center;
        h1 {
            margin: 0;
            font-style: normal;
            font-weight: bold;
        }
    }
}
</style>
