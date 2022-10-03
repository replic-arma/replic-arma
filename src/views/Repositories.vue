<template>
    <div class="repos">
        <div class="repos__heading">
            <h1 v-t="'repositories'"></h1>
            <div class="icon-group">
                <Tooltip text="Downloads" position="bottom">
                    <Downloads />
                </Tooltip>
                <Tooltip text="Reload Repositories">
                    <mdicon name="refresh" size="35" v-once @click="reloadRepos" />
                </Tooltip>
                <Tooltip text="Settings">
                    <ApplicationSettings></ApplicationSettings>
                </Tooltip>
            </div>
        </div>
        <ul class="repos__list">
            <Loader v-if="repos === null" />
            <RepositoryItem v-for="(repo, i) of repos" :key="i" :repository="repo" />
        </ul>
        <RepositoryAdd />
    </div>
</template>

<script lang="ts" setup>
import RepositoryItem from '@/components/repository/RepositoryItem.vue';
import RepositoryAdd from '../components/repository/RepositoryAdd.vue';
import Loader from '@/components/util/Loader.vue';
import { useRepoStore } from '../store/repo';
import { computed } from '@vue/runtime-core';
import Downloads from '../components/download/Downloads.vue';
import ApplicationSettings from '../components/settings/ApplicationSettings.vue';
import Tooltip from '../components/util/Tooltip.vue';
import { notify } from '@kyvg/vue3-notification';
const repos = computed(() => useRepoStore().repos);
function reloadRepos() {
    useRepoStore().recalcRepositories();
    notify({
        title: 'Reloading Repository',
        text: 'Checking for Updates and recalculating the status',
        type: 'success',
    });
}
</script>

<style lang="scss" scoped>
.repos {
    &__list {
        padding: 0;
        display: grid;
        gap: 1rem;
    }
    display: grid;
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto auto;
        font-weight: bold;
        font-size: 14pt;
        align-items: center;
        justify-content: center;

        h1 {
            margin: 0;
            font-weight: bold;
        }

        .icon-group {
            span {
                cursor: pointer;
                justify-content: center;
            }
            color: var(--c-text-3);
            display: grid;
            grid-template-columns: repeat(3, 3rem);
            align-items: center;
            justify-content: center;
        }
    }
}
</style>
