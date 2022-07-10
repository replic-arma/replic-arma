import type { IApplicationSettings } from '@/models/Settings';
import { loadConfig, resetConfig, saveConfig } from '@/util/system/config';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref(null as null | IApplicationSettings);

    function save() {
        if (settings.value === null) throw new Error('Application settings not loaded yet.');
        return saveConfig(settings.value);
    }

    async function reset() {
        const defaults = await resetConfig();
        settings.value = defaults;
    }

    async function applyLocale() {
        const { locale } = useI18n({ useScope: 'global' });
        locale.value = useSettingsStore().settings?.language ?? 'en';
    }

    // load config from the get-go
    loadConfig().then((config) => {
        settings.value = config;
    });

    return {
        settings,
        reset,
        save,
        applyLocale,
    };
});
