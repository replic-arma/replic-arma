<template>
    <mdicon name="tune" role="button" @click="isOpen = true" size="35"></mdicon>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'settings.title'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <Tabs>
                    <Tab title="General">
                        <div class="general-settings">
                            <template v-if="repository">
                                <!-- <small v-once>Build Date: {{ formatDate(repository.build_date) }}</small>
                                <small v-once>Revision: {{ repository.revision }}</small>
                                <small v-once>Files: {{ repository.files.length }}</small> -->
                                <div class="replic-input">
                                    <label>Autoconfig</label>
                                    <div class="replic-input__input-wrapper">
                                        <input
                                            type="text"
                                            class="replic-input__input"
                                            v-model="repository.config_url"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <PathSelector
                                    :pathSelector="{ label: 'mod_directory', name: 'modDirectory' }"
                                    :pathSelectorOptions="{ directory: true }"
                                    v-model="repository.downloadDirectoryPath"
                                ></PathSelector>
                            </template>
                            <button class="button button--danger" v-once @click="removeRepo()" v-t="'remove'"></button>
                            <button class="button" v-once @click="save()" v-t="'save'"></button>
                        </div>
                    </Tab>
                    <Tab title="Launch Options" v-if="repository">
                        <Launch v-model="repository.launchOptions"></Launch>
                        <button class="button" v-once @click="save()" v-t="'save'"></button>
                    </Tab>
                </Tabs>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import type { IReplicArmaRepository } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Launch from './Launch.vue';
import Tab from '../util/Tab.vue';
import Tabs from '../util/Tabs.vue';
import PathSelector from '../util/PathSelector.vue';
import { notify } from '@kyvg/vue3-notification';
import { clearModsetCache } from '@/util/system/modset_cache';
const repository = useRepoStore().currentRepository;
const router = useRouter();
async function removeRepo(): Promise<void> {
    useRepoStore().repos =
        useRepoStore().repos?.filter((repo: IReplicArmaRepository) => repo.id !== repository?.id) ?? [];
    useRepoStore().save();
    notify({
        title: 'Removed Repository',
        text: `Repository ${repository?.name} has been removed`,
        type: 'success',
    });
    clearModsetCache(repository?.id);
    router.push('/');
}

async function save() {
    await useRepoStore().save();
    notify({
        title: 'Saved Settings',
        text: 'Changes have been saved to your disk',
        type: 'success',
    });
}
const isOpen = ref(false);
function formatDate(timestamp: string) {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('de-de');
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

.general-settings {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
