<template>
    <div class="launch-settings">
        <div class="launch-settings__fieldset">
            <span v-t="'settings.base'"></span>
            <ul>
                <li>
                    <input type="checkbox" role="switch" name="noPause" v-model="model.noPause" /><span
                        v-t="'settings.noPause'"
                    ></span>
                </li>
                <li>
                    <input type="checkbox" role="switch" name="window" v-model="model.window" /><span
                        v-t="'settings.window'"
                    ></span>
                </li>
                <li>
                    <input type="checkbox" role="switch" name="checkSignatures" v-model="model.checkSignatures" /><span
                        v-t="'settings.checkSignatures'"
                    ></span>
                </li>
                <li>
                    <input type="string" role="switch" name="name" v-model="model.name" /><span
                        v-t="'settings.name'"
                    ></span>
                </li>
            </ul>
        </div>
        <div class="launch-settings__fieldset">
            <span v-t="'settings.performance'"></span>
            <ul>
                <li>
                    <input type="checkbox" role="switch" name="hugepages" v-model="model.hugepages" /><span
                        v-t="'settings.hugepages'"
                    ></span>
                </li>
                <li>
                    <input type="checkbox" role="switch" name="emptyWorld" v-model="model.emptyWorld" /><span
                        v-t="'settings.emptyWorld'"
                    ></span>
                </li>
                <li>
                    <input type="checkbox" role="switch" name="noLogs" v-model="model.noLogs" /><span
                        v-t="'settings.noLogs'"
                    ></span>
                </li>
                <li>
                    <input type="checkbox" role="switch" name="noSplash" v-model="model.noSplash" /><span
                        v-t="'settings.noSplash'"
                    ></span>
                </li>
                <li>
                    <input type="checkbox" role="switch" name="emptyWorld" v-model="model.emptyWorld" /><span
                        v-t="'settings.emptyWorld'"
                    ></span>
                </li>
                <!-- <li>
                    <input type="string" name="maxMem" v-model="model.maxMem" /><span v-t="'settings.maxMem'"></span>
                </li>
                <li>
                    <input type="string" name="cpuCount" v-model="model.cpuCount" /><span
                        v-t="'settings.cpuCount'"
                    ></span>
                </li>
                <li>
                    <input type="string" name="exThreads" v-model="model.exThreads" /><span
                        v-t="'settings.exThreads'"
                    ></span>
                </li> -->
                <li>
                    <input type="string" name="malloc" v-model="model.malloc" /><span v-t="'settings.malloc'"></span>
                </li>
            </ul>
        </div>
        <div class="launch-settings__fieldset">
            <span v-t="'settings.developer'"></span>
            <ul>
                <li>
                    <input type="checkbox" role="switch" name="filePatching" v-model="model.filePatching" /><span
                        v-t="'settings.filePatching'"
                    ></span>
                </li>
                <li>
                    <input
                        type="checkbox"
                        role="switch"
                        name="showScriptErrors"
                        v-model="model.showScriptErrors"
                    /><span v-t="'settings.showScriptErrors'"></span>
                </li>
            </ul>
        </div>
        <div class="launch-settings__custom">
            <label v-t="'settings.custom_parameter'"></label>
            <textarea />
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { GameLaunchSettings } from '@/models/Settings';
import { useRepoStore } from '@/store/repo';
import { onBeforeUnmount, ref, watch } from 'vue';
interface Props {
    modelValue: GameLaunchSettings;
}

const settings = ref({
    base: {
        noPause: false,
        window: false,
        battleye: false,
        checkSignatures: false,
    },
    performance: {
        hugepages: false,
        emptyWorld: false,
        noLogs: false,
        noSplash: false,
    },
    developer: {
        filePatching: false,
        showScriptErrors: false,
    },
});
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const model = ref(props.modelValue);

watch(model, async (newModel, oldModel) => {
    emit('update:modelValue', newModel);
});

function handleChange(val);
</script>
<style lang="scss" scoped>
.launch-settings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    &__fieldset {
        list-style: none;
        ul {
            padding: 0;
        }
        li {
            margin-block-end: 2rem;
            display: grid;
            grid-template-columns: min-content auto;
            column-gap: 1rem;
        }
    }
    &__custom {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: max-content auto;
        textarea {
            resize: none;
        }
    }
}
</style>
