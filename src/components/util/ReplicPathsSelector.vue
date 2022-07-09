<template>
    <div class="replic-path-selector">
        <label :for="pathSelector.name" v-t="pathSelector.label"></label>
        <div class="replic-path-selector__input-wrapper">
            <input type="text" :id="pathSelector.name" class="replic-path-selector__input" v-model="model" />
            <button class="replic-path-selector__button" @click="openDialog()">
                <span v-t="'select'"></span>
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { open, type OpenDialogOptions } from '@tauri-apps/api/dialog';
import { ref, watch, defineEmits } from 'vue';
interface Props {
    pathSelectorOptions: OpenDialogOptions;
    pathSelector: {
        label: string;
        name: string;
    };
    modelValue: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const model = ref(props.modelValue);

watch(model, async (newModel, oldModel) => {
    emit('update:modelValue', newModel);
});

function openDialog(): void {
    open(props.pathSelectorOptions ?? {}).then((filepath) => {
        if (filepath === null) return;
        model.value = filepath as string;
    });
}
</script>

<style lang="scss" scoped>
.replic-path-selector {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 3rem;
    &__input-wrapper {
        position: relative;
        background: #fff;
        border-radius: 0.5rem;
        display: grid;
        grid-template-columns: 1fr auto;
    }
    &__input {
        padding-inline: 1rem;
        inline-size: 100%;
        block-size: 100%;
        outline: 0;
        border: none;
        background: none;
    }
    &__button {
        block-size: 100%;
        inline-size: 5rem;
        padding-inline-start: var(--space-xs);
        align-content: center;
        justify-content: center;
        background: lightgrey;
        cursor: pointer;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        &:hover {
            background: var(--c-surf-3);
        }
    }
}
</style>
