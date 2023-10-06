<template>
    <div>
        <span></span>
        <Teleport to="#modal-target">
            <div class="replic-dialog" v-if="settings !== null">
                <Progress :current="step"></Progress>
                <ModDirectory :model="settings" v-if="step === 0"></ModDirectory>
                <Executable :model="settings" v-if="step === 1"></Executable>
                <FirstRepository v-if="step === 2"></FirstRepository>
                <div style="display: flex; margin-block-start: 2rem">
                    <button class="button" v-if="step !== 0" @click="step -= 1" role="link">Back</button>
                    <button class="button button--right" v-if="step !== 2" @click="step += 1" role="link">Next</button>
                    <router-link to="/" custom v-slot="{ navigate }">
                        <button class="button button--right" @click="navigate" v-if="step === 2" role="link">
                            Skip
                        </button>
                    </router-link>
                </div>
            </div>
        </Teleport>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Progress from '@/components/util/Progress.vue';
import Executable from '@/components/Setup/Executable.vue';
import ModDirectory from '@/components/Setup/ModDirectory.vue';
import FirstRepository from '@/components/Setup/FirstRepository.vue';
import { useSettingsStore } from '@/store/settings';
const step = ref(0);
const settings = useSettingsStore().settings;
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    display: flex;
    flex-direction: column;
    &__heading {
        align-items: center;
        font-weight: 600;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &__content {
        display: grid;
        margin-block-end: 1rem;
    }
}
</style>
