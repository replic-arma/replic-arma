<template>
    <div class="replic-checkbox" :class="model ? 'active' : ''">
        <label class="replic-checkbox__thumb" :for="'check-' + label"
            ><mdicon v-if="model" name="check" size="15"
        /></label>
        <input class="replic-checkbox__check" type="checkbox" :id="'check-' + label" v-model="model" />
        <label class="replic-checkbox__label" :for="'check-' + label"
            ><span>{{ label }}</span></label
        >
    </div>
</template>
<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';
interface Props {
    label: string;
    default: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(['add', 'remove']);
const model = ref(props.default);
watch(model, async newModel => {
    if (newModel) {
        emit('add', props.label);
    } else {
        emit('remove', props.label);
    }
});
</script>

<style lang="scss" scoped>
.replic-checkbox {
    display: inline-flex;
    background: var(--c-surf-3);
    width: fit-content;
    border-radius: 999px;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
    margin-inline: 0.25rem;
    margin-block: 0.25rem;
    cursor: pointer;
    &__check {
        display: none;
    }
    &__check:checked ~ div {
        display: block;
    }
    &__label {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    &__thumb {
        content: '';
        block-size: 1rem;
        inline-size: 1rem;
        border-radius: 1rem;
        background: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--c-surf-2);
        margin-inline-start: 1rem;
    }
}
.active {
    background: var(--c-surf-2);
}
.active .replic-checkbox__label {
    color: white;
}
</style>
