<template>
    <div class="general-settings">
        <replic-path-selector :pathSelector="{label: $t('a3exe'), name:'a3exe' }" v-model="settingsStore.settings.gamePath"></replic-path-selector>
        <replic-path-selector :pathSelector="{label: $t('mod_directory'), name:'modDirectory' }" :pathSelectorOptions="{directory: true}" v-model="settingsStore.settings.downloadDirectoryPath"></replic-path-selector>
        <div class="general-settings__speed">
            <label for="speed">{{$t('download_max_speed')}}<mdicon name="information" size="15" /></label>
            <select class="select" name="speed" v-model="settingsStore.settings.maxDownloadSpeed">
                <option value="0">unlimited</option>
                <option value="1">1 MB/s</option>
                <option value="2">2 MB/s</option>
                <option value="5">5 MB/s</option>
                <option value="10">10 MB/s</option>
                <option value="25">25 MB/s</option>
            </select>
        </div>
        <div class="general-settings__language">
            <label for="language">{{$t('language')}}<mdicon name="information" size="15" /></label>
            <select class="select" name="language" v-model="settingsStore.settings.language">
                <option value="en">English</option>
                <option value="de">German</option>
            </select>
        </div>
<div class="general-settings__theme">
            <label for="theme">{{$t('settings.theme')}}<mdicon name="information" size="15" /></label>
            <select class="select" name="theme" v-model="settingsStore.settings.theme">
                <option value="light">{{$t('settings.theme_option.light')}}</option>
                <option value="dark">{{$t('settings.theme_option.dark')}}</option>
            </select>
        </div>
        <div class="general-settings__buttons">
            <button class="button button--outline button--danger" type="button">{{$t('cache_clear')}}</button>
            <button class="button button--outline button--danger" type="button" @click="settingsStore.resetSettings()">{{$t('settings.reset')}}</button>
        </div>
    </div>
</template>
<script lang="ts">
import { useSettingsStore } from '@/store/settings';
import { Options, Vue } from 'vue-class-component';

import ReplicPathSelectorVue from '../util/ReplicPathsSelector.vue';
@Options({
    components: {
        ReplicPathSelector: ReplicPathSelectorVue
    }
})
export default class GeneralVue extends Vue {
    private settingsStore = useSettingsStore();
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
        gap: .5rem;
    }

}
</style>
