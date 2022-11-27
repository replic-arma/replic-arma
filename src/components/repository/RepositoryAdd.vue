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
                <div class="loading-text" v-if="loading && submitted">
                    <Loader />
                    <span v-t="'repository_add.fetching'"></span>
                </div>
                <div class="status" v-if="!loading && status !== null">
                    <div class="icon">
                        <template v-if="status">
                            <mdicon name="check-circle" size="35" />
                            <span v-t="'repository_add.success'"></span>
                        </template>
                        <template v-if="!status">
                            <mdicon name="close-circle" size="35" />
                            <span v-t="'repository_add.error'"></span>
                        </template>
                    </div>
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
import Loader from '../util/Loader.vue';
const autoConfigModel = ref('');
const isOpen = ref(false);
const loading = ref(false);
const errorMsg = ref('');
const repoStore = useRepoStore();
const submitted = ref(false);
const status = ref(null as null | boolean);
function addRepo() {
    submitted.value = true;
    loading.value = true;
    repoStore
        .addRepo(autoConfigModel.value)
        .then(() => {
            loading.value = false;
            isOpen.value = false;
            autoConfigModel.value = '';
            // status.value = true;
        })
        .catch(error => {
            // status.value = false;
            console.debug(error);
            loading.value = false;
            errorMsg.value = error;
        });
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
.status {
    display: grid;
    place-content: center;
    text-align: center;
    svg {
        fill: green;
    }
}
</style>
