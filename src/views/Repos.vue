<template>
    <div class="repos">
        <div class="repos__heading">
            <h1 v-t="'repositories'"></h1>
            <div class="icon-group">
                <Downloads />
                <mdicon name="refresh" size="45" v-once @click="reloadRepos" />
                <router-link class="button" to="/settings"><mdicon name="cog" size="45" /></router-link>
            </div>
        </div>
        <ul class="repos__list">
            <Loader v-if="repos === null"/>
            <RepoVue v-for="(repo, i) of repos" :key="i" :repository="repo"></RepoVue>
        </ul>
        <RepositoryAdd />
    </div>
</template>

<script lang="ts" setup>
import RepoVue from '@/components/Repository.vue';
import RepositoryAdd from '../components/RepositoryAdd.vue';
import Loader from '@/components/util/Loader.vue';
import { useRepoStore } from '../store/repo';
import Toast from '@/components/util/Toast';
import { loadRepos } from '@/util/system/repos';
import { computed } from '@vue/runtime-core';
import Downloads from '../components/download/Downloads.vue';
const repos = computed(() => useRepoStore().repos);
function reloadRepos() {
    loadRepos();
    Toast('Reloading Repositories');
};
</script>

<style lang="scss" scoped>
.repos {
    &__list {
        padding: 0;
        display: grid;
        gap: var(--space-sm);
    }
    display: grid;
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto auto;
        font-weight: bold;
        font-size: 22pt;
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
