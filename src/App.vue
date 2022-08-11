<template>
    <rtransition />
    <notifications position="bottom left" />
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
const { locale } = useI18n({ useScope: 'global' });
const router = useRouter();
const store = useSettingsStore();
const { settings } = storeToRefs(store);
watch(
    settings,
    async (newModel, oldModel) => {
        if (newModel !== null) {
            if (newModel !== null && (newModel.downloadDirectoryPath === '' || newModel.gamePath === '')) {
                await router.push('/setup/moddirectory');
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
</script>
