import { ApplicationSettings, GameLaunchSettings } from '@/models/Settings';
import { System } from '@/util/system';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: (): {settings: ApplicationSettings, launchOptions: GameLaunchSettings} => ({
        settings: new ApplicationSettings(),
        launchOptions: new GameLaunchSettings()
    }),
    getters: {
        getSettings: (state) => {
            return state.settings;
        },
        getLaunchOptions: (state) => {
            return state.launchOptions;
        }
    },
    actions: {
        resetSettings () {
            System.resetSettings();
            this.loadData();
        },
        resetLaunchOptions () {
            // TODO
        },
        async loadData () {
            const config = await System.getConfig();
            this.settings = config;
        },
        synchData () {
            System.updateConfig(this.settings);
        }
    }
});
