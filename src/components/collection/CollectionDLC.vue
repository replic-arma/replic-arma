<template>
    <div class="replic-checkbox">
        <label class="replic-checkbox__thumb" :for="'check-' + label"><mdicon v-if="model" name="check" /></label>
        <input class="replic-checkbox__check" type="checkbox" :id="'check-' + label" v-model="model" />
        <label class="replic-checkbox__label" :for="'check-' + label"
            ><span>{{ label }}</span></label
        >
    </div>
</template>
<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { ref, watch } from 'vue';
interface Props {
    label: string;
    id: string;
    default: boolean;
}
const props = defineProps<Props>();
const model = ref(props.default);

watch(model, async (newModel, oldModel) => {
    if (newModel) {
        if (useRepoStore().currentCollection?.dlc === undefined) useRepoStore().currentCollection!.dlc = [];
        useRepoStore().currentCollection!.dlc?.push(props.id);
    } else {
        useRepoStore().currentCollection!.dlc = useRepoStore().currentCollection!.dlc?.filter(
            (dlc: string) => dlc !== props.id
        );
    }
});
</script>

<style lang="scss" scoped>
.replic-checkbox {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    &__check {
        display: none;
    }

    &__check:checked ~ div {
        display: block;
    }

    &__label {
        cursor: pointer;
    }
    &__label span {
        margin-inline-start: 1rem;
    }
    &__thumb {
        content: '';
        block-size: 2rem;
        inline-size: 2rem;
        border-radius: 2rem;
        background: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    &:hover &__folder {
        visibility: visible;
    }
    &__folder {
        visibility: hidden;
        margin-left: auto;
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
        border-radius: 2rem;
        cursor: pointer;
        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }
}
</style>
