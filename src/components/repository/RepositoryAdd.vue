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
                    <div class="loader loader--style1" title="0">
                        <svg
                            version="1.1"
                            id="loader-1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            x="0px"
                            y="0px"
                            width="40px"
                            height="40px"
                            viewBox="0 0 40 40"
                            enable-background="new 0 0 40 40"
                            xml:space="preserve"
                        >
                            <path
                                opacity="0.2"
                                fill="#000"
                                d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
                            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
                            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
                            />
                            <path
                                fill="#000"
                                d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
                            C22.32,8.481,24.301,9.057,26.013,10.047z"
                            >
                                <animateTransform
                                    attributeType="xml"
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 20 20"
                                    to="360 20 20"
                                    dur="0.5s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
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
                                :disabled="loading || autoConfigModel === ''"
                            />
                        </div>
                    </div>
                    <button class="button" @click="addRepo" :disabled="loading" v-t="'submit'"></button>
                </template>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRepoStore } from '@/store/repo';
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
        .catch((error) => {
            // status.value = false;
            console.log(error);
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
    svg path,
    svg rect {
        fill: #ff6700;
    }
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
