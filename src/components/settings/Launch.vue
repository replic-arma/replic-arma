<template>
    <div class="launch-settings">
        <div class="launch-settings__fieldset" v-for="(category, i) of Object.keys(settings)" :key="i">
            <span v-t="'settings.' + category"></span>
            <ul>
                <li v-for="(setting, i) of Object.keys(settings[category])" :key="i">
                    <input type="checkbox" role="switch" :name="setting" /><span v-t="'settings.' + setting"></span>
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
import type { GameLaunchSettings } from "@/models/Settings";
import { useRepoStore } from "@/store/repo";
import { onBeforeUnmount, ref, watch } from "vue";
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

onBeforeUnmount(async () => {
    await useRepoStore().save();
});
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
