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
                        <div class="application-settings" v-if="settings !== null">
                            <PathSelectorVue
                                :pathSelector="{
                                    label: 'a3exe',
                                    name: 'a3exe',
                                    placeholder: 'C:\\Program Files\\Steam\\steamapps\common\\Arma 3\\arma3_x64.exe'
                                }"
                                :pathSelectorOptions="{}"
                                v-model="settings.gamePath"
                            ></PathSelectorVue>
                            <PathSelectorVue
                                :pathSelector="{
                                    label: 'mod_directory',
                                    name: 'modDirectory',
                                    placeholder: 'C:\\Documents\\Arma3Mods'
                                }"
                                :pathSelectorOptions="{ directory: true }"
                                v-model="settings.downloadDirectoryPath"
                            ></PathSelectorVue>
                            <!-- <div class="application-settings__speed">
                                <label for="speed" v-t="'download_max_speed'"></label>
                                <select class="select" name="speed" v-model="settings.maxDownloadSpeed">
                                    <option value="0">unlimited</option>
                                    <option value="1">1 MB/s</option>
                                    <option value="2">2 MB/s</option>
                                    <option value="5">5 MB/s</option>
                                    <option value="10">10 MB/s</option>
                                    <option value="25">25 MB/s</option>
                                </select>
                            </div> -->
                            <div class="application-settings__maxConnections">
                                <label for="maxConnections" v-t="'settings.max_connections'"></label>
                                <select class="select" name="maxConnections" v-model="settings.maxConnections">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                            </div>
                            <div class="application-settings__language">
                                <label for="language" v-t="'language'"></label>
                                <select class="select" name="language" v-model="settings.language">
                                    <option value="en">English</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                            <div class="application-settings__theme">
                                <label for="theme" v-t="'settings.theme'"></label>
                                <select class="select" name="theme" v-model="settings.theme">
                                    <option value="light" v-t="'settings.theme_option.light'"></option>
                                    <option value="dark" v-t="'settings.theme_option.dark'"></option>
                                </select>
                            </div>
                            <div class="application-settings__buttons">
                                <button
                                    class="button button--danger"
                                    type="button"
                                    v-t="'settings.reset'"
                                    @click="resetSettings()"
                                ></button>
                                <button
                                    class="button button--danger"
                                    type="button"
                                    v-t="'cache_clear'"
                                    @click="clearCache()"
                                ></button>
                                <button
                                    class="button button--primary"
                                    style="margin-left: auto"
                                    type="button"
                                    v-t="'save'"
                                    @click="saveSettings()"
                                ></button>
                            </div>
                        </div>
                    </Tab>
                    <Tab title="Launch Options">
                        <Launch v-if="settings" v-model="settings.launchOptions"></Launch>
                        <div class="application-settings__buttons">
                            <button class="button button--center" v-once @click="saveSettings()" v-t="'save'"></button>
                        </div>
                    </Tab>
                    <Tab title="About">
                        <About></About>
                    </Tab>
                </Tabs>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { clearModsetCache } from '@/util/system/modset_cache';
import { ref, toRaw } from 'vue';
import PathSelectorVue from '../util/PathSelector.vue';
import Tabs from '../util/Tabs.vue';
import Tab from '../util/Tab.vue';
import { notify } from '@kyvg/vue3-notification';
import About from './About.vue';
import Launch from './Launch.vue';
const settingsStore = useSettingsStore();
const settings = toRaw(settingsStore.settings);
async function saveSettings() {
    settingsStore.settings = settings;
    await settingsStore.save();
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success'
    });
}
async function clearCache() {
    await clearModsetCache();
    notify({
        title: 'Cleared Modset cache',
        text: 'Cleared old Modset cache',
        type: 'success'
    });
}
async function resetSettings() {
    await settingsStore.reset();
    notify({
        title: 'Reset Settings',
        text: 'Settings have been reset to default',
        type: 'success'
    });
}
const isOpen = ref(false);
</script>
<style lang="scss" scoped>
.application-settings {
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
    &__maxConnections {
        display: flex;
        flex-direction: column;
    }
    &__theme {
        display: flex;
        flex-direction: column;
    }
    &__buttons {
        margin-block-start: 2rem;
        display: flex;
        gap: 1rem;
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
        font-weight: 600;
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
