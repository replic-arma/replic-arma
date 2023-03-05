<template>
    <div class="add-button" @click="isOpen = true">
        <mdicon name="plus" role="button"></mdicon>
    </div>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'repository.add'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <div class="loading-text" v-if="loading">
                    <Loader />
                    <span v-t="'repository_add.fetching'"></span>
                </div>
                <template v-if="!loading">
                    <div class="txt">
                        <label for="repoName" v-t="'repository.autoconfig'"></label>
                        <div class="txt__input-wrapper">
                            <input
                                class="txt__input"
                                type="text"
                                name="repoName"
                                v-model="autoConfigModel"
                                :disabled="loading"
                            />
                        </div>
                    </div>
                    <button
                        class="button button--center"
                        @click="addRepo"
                        :disabled="loading || autoConfigModel === ''"
                        v-t="'submit'"
                    ></button>
                </template>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRepoStore } from '@/store/repo';
import Loader from '@/components/util/Loader.vue';
import { isReplicArmaError } from '@/models/Error';
import { notify } from '@kyvg/vue3-notification';
import { useI18n } from 'vue-i18n';
const autoConfigModel = ref('');
const isOpen = ref(false);
const loading = ref(false);
const repoStore = useRepoStore();
const { t } = useI18n();
async function addRepo() {
    loading.value = true;

    try {
        await repoStore.addRepo(autoConfigModel.value);
        loading.value = false;
        isOpen.value = false;
        autoConfigModel.value = '';
    } catch (err) {
        if (isReplicArmaError(err)) {
            console.log(err);
            notify({
                title: t('repository_add.error'),
                text: err.description,
                type: 'error'
            });
        }
    } finally {
        loading.value = false;
    }
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
        font-weight: 600;
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
    &__content {
        position: relative;
    }
}
.loading-text {
    display: grid;
    place-content: center;
    text-align: center;
}
</style>
