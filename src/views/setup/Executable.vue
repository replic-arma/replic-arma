<template>
    <div>
        <Teleport to="#modal-target">
            <div class="replic-dialog">
                <Progress :current="1"></Progress>
                <div class="replic-dialog__heading">
                    <h1>Setup</h1>
                    <p>Next you need to select your Arma 3 Executable (This can also be changed later).</p>
                </div>
                <div class="replic-dialog__content" v-if="!inProgress && settings !== null">
                    <div>
                        <PathSelector
                            :pathSelector="{ label: 'a3exe', name: 'a3exe' }"
                            :pathSelectorOptions="{}"
                            v-model="settings.gamePath"
                        ></PathSelector>
                    </div>
                    <button
                        class="button button--center"
                        @click="saveSettings()"
                        role="link"
                        :disabled="settings.gamePath === ''"
                    >
                        Next
                    </button>
                </div>
            </div>
        </Teleport>
    </div>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { computed, ref } from 'vue';
import PathSelector from '../../components/util/PathSelector.vue';
import Progress from '../../components/util/Progress.vue';
import { getA3PathRegistry } from '@/util/system/game';
import { notify } from '@kyvg/vue3-notification';
import { useRouter } from 'vue-router';
const inProgress = ref(true);
const settings = computed(() => {
    return useSettingsStore().settings;
});
resolvePath();
async function resolvePath() {
    useSettingsStore().settings!.gamePath = `${await getA3PathRegistry()}\\arma3.exe`;
    inProgress.value = false;
}
const router = useRouter();
async function saveSettings() {
    await useSettingsStore().save();
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success',
    });
    router.push('/setup/firstRepository');
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        align-items: center;
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
