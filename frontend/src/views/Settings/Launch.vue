<template>
    <LaunchOptions v-if="model !== null" v-model="model.launchOptions"></LaunchOptions>
    <div class="application-settings__buttons">
        <button class="button button--right" v-once @click="saveSettings()" v-t="'save'"></button>
    </div>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { toRaw } from 'vue';
import LaunchOptions from '@/components/LaunchOptions.vue';
import { notify } from '@kyvg/vue3-notification';
useSettingsStore();
const settingsStore = useSettingsStore();
const model = toRaw(settingsStore.settings);
async function saveSettings() {
    settingsStore.settings = model;
    await settingsStore.save();
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success'
    });
}
</script>
<style lang="scss" scoped>
.application-settings {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 1.5rem;
    grid-template-columns: 1fr;

    &__buttons {
        margin-block-start: 2rem;
        display: flex;
    }
}
</style>
