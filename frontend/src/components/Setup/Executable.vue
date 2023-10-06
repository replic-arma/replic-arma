<template>
    <h1>Setup</h1>
    <p>Next you need to select your Arma 3 Executable (This can also be changed later).</p>
    <Loader v-if="inProgress"></Loader>
    <PathSelector
        v-else
        :pathSelector="{
            label: 'a3exe',
            name: 'a3exe',
            placeholder: 'C:\\Program Files\\Steam\\steamapps\common\\Arma 3\\arma3_x64.exe'
        }"
        :pathSelectorOptions="{}"
        v-model="settings.gamePath"
    ></PathSelector>
</template>
<script lang="ts" setup>
import { useSettingsStore } from '@/store/settings';
import { ref, type PropType } from 'vue';
import PathSelector from '@/components/util/PathSelector.vue';
import { getA3PathRegistry } from '@/util/system/game';
import type { IApplicationSettings } from '@/models/Settings';
import Loader from '@/components/util/Loader.vue';
const inProgress = ref(true);

resolvePath();
async function resolvePath() {
    useSettingsStore().settings!.gamePath = `${await getA3PathRegistry()}\\arma3_x64.exe`;
    inProgress.value = false;
}

const props = defineProps({
    model: {
        type: Object as PropType<IApplicationSettings>,
        required: true
    }
});
const settings = ref(props.model);
</script>
