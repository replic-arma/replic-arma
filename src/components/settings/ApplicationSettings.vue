<template>
    <mdicon name="tune" role="button" size="35" @click="isOpen = true"></mdicon>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'settings.title'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <Tabs>
                    <Tab title="General">
                        <div class="general-settings" v-if="settingsCopy !== null">
                            <PathSelectorVue
                                :pathSelector="{ label: 'a3exe', name: 'a3exe' }"
                                :pathSelectorOptions="{}"
                                v-model="settingsCopy.gamePath"
                            ></PathSelectorVue>
                            <PathSelectorVue
                                :pathSelector="{ label: 'mod_directory', name: 'modDirectory' }"
                                :pathSelectorOptions="{ directory: true }"
                                v-model="settingsCopy.downloadDirectoryPath"
                            ></PathSelectorVue>
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
                                <button
                                    class="button button--danger"
                                    type="button"
                                    v-t="'cache_clear'"
                                    @click="clearCache()"
                                ></button>
                                <button class="button button--danger" type="button" v-t="'settings.reset'"></button>
                                <button
                                    class="button button--primary"
                                    type="button"
                                    v-t="'save'"
                                    @click="saveSettings()"
                                ></button>
                            </div>
                        </div>
                    </Tab>
                    <Tab title="Launch Options">
                        <Launch v-if="settingsCopy" v-model="settingsCopy.launchOptions"></Launch>
                        <button class="button" v-once @click="saveSettings()" v-t="'save'"></button>
                    </Tab>
                </Tabs>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { clearModsetCache } from '@/util/system/modset_cache';
import { computed, ref } from 'vue';
import PathSelectorVue from '../util/PathSelector.vue';
import Tabs from '../util/Tabs.vue';
import Tab from '../util/Tab.vue';
import Launch from './Launch.vue';
import { notify } from '@kyvg/vue3-notification';
const settingsCopy = computed(() => {
    return useSettingsStore().settings;
});
function saveSettings() {
    useSettingsStore().settings = settingsCopy.value;
    useSettingsStore().save();
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success',
    });
}
async function clearCache() {
    await clearModsetCache();
    notify({
        title: 'Cleared Modset cache',
        text: 'Cleared old Modset cache',
        type: 'success',
    });
}
async function resetSettings() {
    await useSettingsStore().reset();
    notify({
        title: 'Reset Settings',
        text: 'Settings have been reset to default',
        type: 'success',
    });
}
const isOpen = ref(false);
</script>
<style lang="scss" scoped>
.general-settings {
    display: flex;
    flex-direction: column;
    position: relative;
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
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &__content {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
