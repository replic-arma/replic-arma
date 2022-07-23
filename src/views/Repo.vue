<template>
    <div class="repo-view">
        <div class="repo-view__heading">
            <Tooltip text="Go Back">
                <router-link class="button" to="/"><mdicon name="chevron-left" size="45" /></router-link>
            </Tooltip>
            <template v-if="repository !== undefined">
                <h1>{{ repository.name }}</h1>
                <div class="icon-group">
                    <Tooltip text="Downloads" position="bottom">
                        <Downloads />
                    </Tooltip>
                    <Tooltip text="Refresh Repository">
                        <mdicon name="refresh" size="35" @click="checkRepo()" />
                    </Tooltip>
                    <Tooltip text="Settings">
                        <RepoSettings></RepoSettings>
                    </Tooltip>
                </div>
            </template>
            <Loader v-else />
        </div>
        <SubnaviVue v-if="repository !== undefined" :subnaviItems="subnaviItems"></SubnaviVue>
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import SubnaviVue from '@/components/util/Subnavi.vue';
import Loader from '@/components/util/Loader.vue';
import { useRepoStore } from '../store/repo';
import { computed } from '@vue/runtime-core';
import RepoSettings from '../components/settings/RepoSettings.vue';
import { notify } from '@kyvg/vue3-notification';
import Downloads from '../components/download/Downloads.vue';

const repository = computed(() => useRepoStore().currentRepository);
const subnaviItems = computed(() => {
    return [
        { label: 'modsets', link: '/repo/' + repository.value?.id + '/modsets' },
        { label: 'collections', link: '/repo/' + repository.value?.id + '/collections' },
        { label: 'server.title', link: '/repo/' + repository.value?.id + '/servers' },
    ];
});
function checkRepo() {
    if (repository.value === undefined) return;
    useRepoStore().recalcRepository(repository.value);
    notify({
        title: 'Reloading Repositories',
        text: 'Checking for Updates and recalculating the status',
        type: 'success',
    });
}
</script>

<style lang="scss" scoped>
.repo-view {
    position: relative;
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto auto;
        font-size: 16pt;
        align-items: center;
        justify-content: center;
        h1 {
            margin: 0;
            font-style: normal;
            font-weight: bold;
        }
        .icon-group {
            display: grid;
            grid-template-columns: 3rem 3rem 3rem;
            align-items: center;
            justify-content: center;
            color: var(--c-text-3);
            cursor: pointer;
            .mdi {
                display: inline-flex;
                justify-content: center;
            }
        }
    }
}
</style>
