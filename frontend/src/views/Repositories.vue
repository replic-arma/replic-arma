<template>
    <div class="repos">
        <div class="repos__heading">
            <h1 v-t="'repositories'"></h1>
            <div class="icon-group">
                <Downloads />
                <Tooltip text="Reload Repositories">
                    <mdicon name="refresh" size="35" v-once @click="reloadRepos" />
                </Tooltip>
                <Tooltip text="Settings">
                    <router-link to="settings/general">
                        <mdicon name="cog" role="button" size="35"></mdicon>
                    </router-link>
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
import RepositoryItem from '@/components/Repository/RepositoryItem.vue';
import RepositoryAdd from '@/components/Repository/RepositoryAdd.vue';
import Loader from '@/components/util/Loader.vue';
import { useRepoStore } from '@/store/repo';
import { computed } from '@vue/runtime-core';
import Downloads from '@/components/Download/Downloads.vue';
import Tooltip from '@/components/util/Tooltip.vue';
const repos = computed(() => useRepoStore().repos);
function reloadRepos() {
    useRepoStore().recalcRepositories();
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
