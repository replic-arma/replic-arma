<template>
    <div class="launch-settings">
        <div class="launch-settings__fieldset">
            <span class="launch-settings__fieldset--title" v-t="'settings.base'"></span>
            <ul>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="noPause" v-model="model.noPause" /><span
                        v-t="'settings.noPause'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="window" v-model="model.window" /><span
                        v-t="'settings.window'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="checkSignatures" v-model="model.checkSignatures" /><span
                        v-t="'settings.checkSignatures'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="skipIntro" v-model="model.skipIntro" /><span
                        v-t="'settings.checkSignatures'"
                    ></span>
                </li>
                <li style="max-width: 85%">
                    <div class="replic-input">
                        <label v-t="'settings.name'"></label>
                        <div class="replic-input__input-wrapper">
                            <input class="replic-input__input" type="text" name="name" v-model="model.name" />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="launch-settings__fieldset">
            <span class="launch-settings__fieldset--title" v-t="'settings.performance'"></span>
            <ul>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="hugepages" v-model="model.hugepages" /><span
                        v-t="'settings.hugepages'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="emptyWorld" v-model="model.emptyWorld" /><span
                        v-t="'settings.emptyWorld'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="noLogs" v-model="model.noLogs" /><span
                        v-t="'settings.noLogs'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="noSplash" v-model="model.noSplash" /><span
                        v-t="'settings.noSplash'"
                    ></span>
                </li>
                <li>
                    <div class="replic-input">
                        <label v-t="'settings.maxMem'"></label>
                        <div class="replic-input__input-wrapper">
                            <input class="replic-input__input" type="text" name="maxMem" v-model="model.maxMem" />
                        </div>
                    </div>
                </li>
                <li>
                    <div class="replic-input">
                        <label v-t="'settings.cpuCount'"></label>
                        <div class="replic-input__input-wrapper">
                            <input class="replic-input__input" type="text" name="cpuCount" v-model="model.cpuCount" />
                        </div>
                    </div>
                </li>
                <li>
                    <div class="replic-input">
                        <label v-t="'settings.exThreads'"></label>
                        <div class="replic-input__input-wrapper">
                            <input class="replic-input__input" type="text" name="exThreads" v-model="model.exThreads" />
                        </div>
                    </div>
                </li>
                <li>
                    <div class="replic-input">
                        <label v-t="'settings.malloc'"></label>
                        <div class="replic-input__input-wrapper">
                            <input class="replic-input__input" type="text" name="malloc" v-model="model.malloc" />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="launch-settings__fieldset">
            <span class="launch-settings__fieldset--title" v-t="'settings.developer'"></span>
            <ul>
                <li class="launch-settings__checkbox">
                    <input type="checkbox" role="switch" name="filePatching" v-model="model.filePatching" /><span
                        v-t="'settings.filePatching'"
                    ></span>
                </li>
                <li class="launch-settings__checkbox">
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
            <label class="launch-settings__fieldset--title" v-t="'settings.custom_parameter'"></label>
            <textarea />
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { GameLaunchSettings } from '@/models/Settings';
import { ref, watch } from 'vue';
interface Props {
    modelValue: GameLaunchSettings;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const model = ref(props.modelValue);

watch(model, async (newModel, oldModel) => {
    emit('update:modelValue', newModel);
});
</script>
<style lang="scss" scoped>
.launch-settings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    &__fieldset {
        &--title {
            font-weight: bold;
        }
        ul {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    }
    &__checkbox {
        display: grid;
        grid-template-columns: min-content auto;
        column-gap: 1rem;
    }
    &__custom {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: max-content auto;
        textarea {
            resize: none;
            outline: 0;
            border: transparent;
            border-radius: 0.5rem;
        }
    }
}
</style>
