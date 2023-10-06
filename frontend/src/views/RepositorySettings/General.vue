<template>
    <div class="repo-settings">
        <template v-if="model">
            <!-- <small v-once>Build Date: {{ formatDate(repository.build_date) }}</small>
                                <small v-once>Revision: {{ repository.revision }}</small>
                                <small v-once>Files: {{ repository.files.length }}</small> -->
            <div class="replic-input">
                <label>Autoconfig</label>
                <div class="replic-input__input-wrapper">
                    <input type="text" class="replic-input__input" v-model="model.config_url" disabled />
                </div>
            </div>
            <PathSelector
                :pathSelector="{
                    label: 'mod_directory',
                    name: 'modDirectory',
                    placeholder: 'C:\\Documents\\Arma3Mods'
                }"
                :pathSelectorOptions="{ directory: true }"
                v-model="model.downloadDirectoryPath"
            ></PathSelector>
        </template>
        <div class="repo-settings__buttons">
            <button class="button button--danger" v-once @click="removeRepo()" v-t="'remove'"></button>
            <button style="margin-left: auto" class="button" v-once @click="save()" v-t="'save'"></button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { IReplicArmaRepository } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { ref, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import PathSelector from '@/components/util/PathSelector.vue';
import { notify } from '@kyvg/vue3-notification';
import { clearModsetCache } from '@/util/system/modset_cache';
const props = defineProps({
    model: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
const model = ref(props.model);
const router = useRouter();
async function removeRepo(): Promise<void> {
    useRepoStore().repos =
        useRepoStore().repos?.filter((repo: IReplicArmaRepository) => repo.id !== model.value?.id) ?? [];
    useRepoStore().save();
    notify({
        title: 'Removed Repository',
        text: `Repository ${model.value?.name} has been removed`,
        type: 'success'
    });
    clearModsetCache(model.value?.id);
    router.push('/');
}

async function save() {
    await useRepoStore().save();
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success'
    });
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
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

.repo-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &__buttons {
        margin-block-start: 2rem;
        display: flex;
        gap: 1rem;
    }
    &__buttons {
        margin-block-start: 2rem;
        display: flex;
        gap: 1rem;
    }
}
</style>
