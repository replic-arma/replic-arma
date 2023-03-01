<template>
    <h1 v-t="'setup'"></h1>
    <p v-t="'first_repository'"></p>
    <div class="loading-text" v-if="loading && submitted">
        <Loader></Loader>
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
            style="margin-block-start: 1rem"
            class="button button--center"
            @click="addRepo"
            :disabled="loading || autoConfigModel === ''"
            v-t="'submit'"
        ></button>
    </template>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRepoStore } from '@/store/repo';
import { useRouter } from 'vue-router';
import Loader from '@/components/util/Loader.vue';
import { useSettingsStore } from '@/store/settings';
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
        .catch(error => {
            console.debug(error);
            loading.value = false;
            errorMsg.value = error;
        });
}
useSettingsStore().save();
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
