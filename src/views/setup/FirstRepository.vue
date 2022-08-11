<template>
    <div>
        <Teleport to="#modal-target">
            <div class="replic-dialog">
                <Progress :current="2"></Progress>
                <div class="replic-dialog__heading">
                    <h1>Setup</h1>
                    <p>Now it's time to add your first Repository.</p>
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
                        <span>Fetching Repository</span>
                    </div>
                    <div class="status" v-if="!loading && status !== null">
                        <div class="icon">
                            <template v-if="status">
                                <mdicon name="check-circle" size="35" />
                                <span>Successfully added Repository</span>
                            </template>
                            <template v-if="!status">
                                <mdicon name="close-circle" size="35" />
                                <span>Failed to add Repository</span>
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
                                    placeholder="http://a3s.gruppe-adler.de/mods/.a3s/autoconfig"
                                />
                            </div>
                        </div>
                        <button
                            class="button button--center"
                            @click="addRepo"
                            :disabled="loading || autoConfigModel === ''"
                            v-t="'submit'"
                        ></button>
                        <router-link to="/" custom v-slot="{ navigate }">
                            <a
                                @click="navigate"
                                @keypress.enter="navigate"
                                class="button button--center skip"
                                role="link"
                                >Skip</a
                            >
                        </router-link>
                    </template>
                </div>
            </div>
        </Teleport>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import Progress from '../../components/util/Progress.vue';
import { useRepoStore } from '@/store/repo';
import { useRouter } from 'vue-router';
const autoConfigModel = ref('');
const loading = ref(false);
const errorMsg = ref('');
const repoStore = useRepoStore();
const submitted = ref(false);
const status = ref(null as null | boolean);
const router = useRouter();
function addRepo() {
    submitted.value = true;
    loading.value = true;
    repoStore
        .addRepo(autoConfigModel.value)
        .then(() => {
            loading.value = false;
            autoConfigModel.value = '';
            router.push('/');
        })
        .catch((error) => {
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
        align-items: center;
        font-weight: 600;
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
.loading-text {
    display: grid;
    place-content: center;
    text-align: center;
    svg path,
    svg rect {
        fill: var(--c-surf-2);
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
.skip {
    &:hover {
        text-decoration: underline;
    }
    color: gray;
    font-size: 12pt;
}
</style>
