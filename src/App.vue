<template>
    <rtransition />
    <notifications position="bottom left" />
    <OnlineStatus></OnlineStatus>
    <DeepLink></DeepLink>
</template>

<style lang="scss">
@import 'styles/global.scss';
</style>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSettingsStore } from './store/settings';
import OnlineStatus from './components/util/OnlineStatus.vue';
import DeepLink from './components/DeepLink.vue';
import { setupListener as setupHashListener } from './util/system/hashes';
import { setupListener as setupDownloadListener } from './util/system/download';
import { setupListener as setupDeepLinkListener } from './util/system/deep-link';
import type { UnlistenFn } from '@tauri-apps/api/event';
const { locale } = useI18n({ useScope: 'global' });
const router = useRouter();
const store = useSettingsStore();
const { settings } = storeToRefs(store);
watch(
    settings,
    async newModel => {
        if (newModel !== null) {
            if (newModel !== null && (newModel.downloadDirectoryPath === '' || newModel.gamePath === '')) {
                await router.push('/setup');
            }
            if (newModel.theme !== undefined) {
                document.documentElement.setAttribute('data-theme', newModel.theme);
            }
            locale.value = newModel.language ?? 'en';
        }
    },
    { deep: true }
);

// Disable RightClick
// document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('keydown', function (event) {
    if (
        // Print
        (event.ctrlKey && event.key === 'p') ||
        // Search
        event.key === 'F3' ||
        // Refresh
        event.key === 'F5' ||
        // Caret Browsing
        event.key === 'F7' ||
        // Debug
        event.key === 'F12'
    ) {
        event.preventDefault();
    }
});
let listener: UnlistenFn[] = [];
Promise.all([setupHashListener(), setupDownloadListener(), setupDeepLinkListener()]).then(
    unlistener => (listener = [...unlistener.flat()])
);

onBeforeUnmount(() => {
    listener.forEach(listener => listener());
});
</script>
