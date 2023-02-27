<template>
    <h1 v-t="'setup'"></h1>
    <p v-t="'general_mod_directory'"></p>
    <Loader v-if="settings === null"></Loader>
    <PathSelector
        v-else
        :pathSelector="{
            label: 'mod_directory',
            name: 'modDirectory',
            placeholder: 'C:\\Documents\\Arma3Mods'
        }"
        :pathSelectorOptions="{ directory: true }"
        v-model="settings.downloadDirectoryPath"
    ></PathSelector>
</template>
<script lang="ts" setup>
import type { IApplicationSettings } from '@/models/Settings';
import { ref, type PropType } from 'vue';
import PathSelector from '../../components/util/PathSelector.vue';
import Loader from '../util/Loader.vue';

const props = defineProps({
    model: {
        type: Object as PropType<IApplicationSettings>,
        required: true
    }
});
const settings = ref(props.model);
</script>
