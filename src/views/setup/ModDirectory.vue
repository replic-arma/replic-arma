<template>
    <div>
        <Teleport to="#modal-target">
            <div class="replic-dialog">
                <Progress :current="0"></Progress>
                <div class="replic-dialog__heading">
                    <h1>Setup</h1>
                    <p>
                        This seems to be the first time launching Replic Arma. First you need to specify where you want
                        to store your mods (Don't worry you can change it later).
                    </p>
                </div>
                <div class="replic-dialog__content" v-if="settings !== null">
                    <div>
                        <PathSelector
                            :pathSelector="{
                                label: 'mod_directory',
                                name: 'modDirectory',
                                placeholder: 'C:\\Documents\\Arma3Mods',
                            }"
                            :pathSelectorOptions="{ directory: true }"
                            v-model="settings.downloadDirectoryPath"
                        ></PathSelector>
                    </div>
                    <router-link to="/setup/executable" custom v-slot="{ navigate }">
                        <button
                            class="button button--right"
                            @click="navigate"
                            @keypress.enter="navigate"
                            role="link"
                            :disabled="settings.downloadDirectoryPath === ''"
                        >
                            Next
                        </button>
                    </router-link>
                </div>
            </div>
        </Teleport>
    </div>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { computed } from 'vue';
import PathSelector from '../../components/util/PathSelector.vue';
import Progress from '../../components/util/Progress.vue';

const settings = computed(() => {
    return useSettingsStore().settings;
});
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        align-items: center;
        margin-block-end: 2rem;
        font-weight: 600;
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
