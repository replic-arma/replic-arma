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
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSettingsStore } from './store/settings';
import OnlineStatus from './components/util/OnlineStatus.vue';
import DeepLink from './components/DeepLink.vue';
import { listen, type TauriEvent } from '@tauri-apps/api/event';
import { HASHING_PROGRESS } from './util/system/hashes';
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

await listen(
    'hash_calculated',
    (e: TauriEvent<{ hash: string; path: string; size: number; time_modified: number }>) => {
        const { path: absolutePath, hash, time_modified: lastModified, size } = e.payload;

        const event = new CustomEvent('hash_calculated', { detail: { absolutePath, hash, lastModified, size } });
        HASHING_PROGRESS.dispatchTypedEvent('hash_calculated', event);
    }
);

await listen('hash_failed', (e: TauriEvent<string>) => {
    const event = new CustomEvent('hash_failed', { detail: { absolutePath: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('hash_failed', event);
});

await listen('outdated_file_count', (e: TauriEvent<number>) => {
    const event = new CustomEvent('outdated_file_count', { detail: { count: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('outdated_file_count', event);
});

await listen('zsync_completed', (e: TauriEvent<string>) => {
    const event = new CustomEvent('zsync_completed', { detail: { filename: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('zsync_completed', event);
});

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
</script>
