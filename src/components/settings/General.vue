<template>
    <div class="general-settings" v-if="settingsCopy !== null">
        <ReplicPathSelectorVue
            :pathSelector="{ label: 'a3exe', name: 'a3exe' }"
            v-model="settingsCopy.gamePath"
        ></ReplicPathSelectorVue>
        <ReplicPathSelectorVue
            :pathSelector="{ label: 'mod_directory', name: 'modDirectory' }"
            :pathSelectorOptions="{ directory: true }"
            v-model="settingsCopy.downloadDirectoryPath"
        ></ReplicPathSelectorVue>
        <div class="general-settings__speed">
            <label for="speed" v-t="'download_max_speed'"></label>
            <select class="select" name="speed" v-model="settingsCopy.maxDownloadSpeed">
                <option value="0">unlimited</option>
                <option value="1">1 MB/s</option>
                <option value="2">2 MB/s</option>
                <option value="5">5 MB/s</option>
                <option value="10">10 MB/s</option>
                <option value="25">25 MB/s</option>
            </select>
        </div>
        <div class="general-settings__language">
            <label for="language" v-t="'language'"></label>
            <select class="select" name="language" v-model="settingsCopy.language">
                <option value="en">English</option>
                <option value="de">German</option>
            </select>
        </div>
        <div class="general-settings__theme">
            <label for="theme" v-t="'settings.theme'"></label>
            <select class="select" name="theme" v-model="settingsCopy.theme">
                <option value="light" v-t="'settings.theme_option.light'"></option>
                <option value="dark" v-t="'settings.theme_option.dark'"></option>
            </select>
        </div>
        <div class="general-settings__buttons">
            <button class="button button--danger" type="button" v-t="'cache_clear'" @click="clearCache()"></button>
            <button class="button button--danger" type="button" v-t="'settings.reset'"></button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { clearModsetCache } from '@/util/system/modset_cache';
import ReplicPathSelectorVue from '../util/ReplicPathsSelector.vue';
const settingsCopy = useSettingsStore().settings;

function clearCache () {
    clearModsetCache();
}
</script>
<style lang="scss" scoped>
.general-settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    grid-template-columns: 1fr;
    &__speed {
        display: flex;
        flex-direction: column;
    }
    &__language {
        display: flex;
        flex-direction: column;
    }
    &__theme {
        display: flex;
        flex-direction: column;
    }
    &__buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
