<template>
    <LaunchOptions v-if="launchOptions !== null" v-model="launchOptions"></LaunchOptions>
    <div class="application-settings__buttons">
        <button class="button button--right" v-once @click="saveSettings()" v-t="'save'"></button>
    </div>
</template>
<script lang="ts" setup>
import { type PropType, ref } from 'vue';
import LaunchOptions from '@/components/LaunchOptions.vue';
import type { IReplicArmaRepository } from '@/models/Repository';
import { useRepository } from '@/composables/useRepository';
import { notify } from '@kyvg/vue3-notification';
const props = defineProps({
    model: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});

const { updateLaunchOptions } = useRepository(props.model.id);
const launchOptions = ref(props.model.launchOptions);
async function saveSettings() {
    await updateLaunchOptions(launchOptions.value);
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success'
    });
}
</script>
<style lang="scss" scoped>
.application-settings {
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 1.5rem;
    grid-template-columns: 1fr;

    &__buttons {
        margin-block-start: 2rem;
        display: flex;
    }
}
</style>
