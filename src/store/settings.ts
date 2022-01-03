import { ApplicationSettings, GameLaunchSettings } from '@/models/Settings';
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: (): {settings: ApplicationSettings, launchOptions: GameLaunchSettings} => ({
        settings: {
            language: 'en',
            theme: 'dark',
            gamePath: '',
            downloadDirectoryPath: '',
            maxDownloadSpeed: -1
        },
        launchOptions: {
            noPause: false,
            window: false,
            showScriptErrors: false,
            noSplash: false,
            name: null,
            checkSignatures: false,
            filePatching: false,
            maxMem: null,
            cpuCount: null,
            malloc: null,
            exThreads: null,
            enableHT: false,
            hugepages: false,
            emptyWorld: false,
            noLogs: false,
            customParameter: '',
            battleye: false
        }
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
            this.settings = {
                language: 'en',
                theme: 'dark',
                gamePath: '',
                downloadDirectoryPath: '',
                maxDownloadSpeed: -1
            };
        },
        resetLaunchOptions () {
            this.launchOptions = {
                noPause: false,
                window: false,
                showScriptErrors: false,
                noSplash: false,
                name: null,
                checkSignatures: false,
                filePatching: false,
                maxMem: null,
                cpuCount: null,
                malloc: null,
                exThreads: null,
                enableHT: false,
                hugepages: false,
                emptyWorld: false,
                noLogs: false,
                customParameter: '',
                battleye: false
            };
        },
        loadData () {
            // TODO call tauri command to fill settings and launch options
        },
        synchData () {
            // TODO call tauri command to save settings and launch options in settings file
        }
    }
});
