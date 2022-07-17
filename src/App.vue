<template>
    <rtransition />
    <notifications position="bottom left" />
</template>

<style lang="scss">
@import 'styles/global.scss';
</style>
<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from './store/settings';
const settings = computed(() => useSettingsStore().settings);
const router = useRouter();
watch(settings, async (newModel, oldModel) => {
    if (newModel !== null && (newModel.downloadDirectoryPath === '' || newModel.gamePath === '')) {
        await router.push('/setup/moddirectory');
    }
});
</script>
