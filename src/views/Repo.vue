<template>
    <div class="repo-view">
        <div class="repo-view__heading">
            <router-link class="button" to="/"><mdicon name="chevron-left" size="55" /></router-link>
            <template v-if="repository">
                <h1>{{ repository.name }}</h1>
                <div class="icon-group">
                    <mdicon name="refresh" size="45" @click="checkRepo" />
                    <router-link class="button" :to="'/reposettings/' + repository.id"
                        ><mdicon name="cog" size="55"
                    /></router-link>
                </div>
            </template>
            <Loader v-else />
        </div>
        <SubnaviVue :subnaviItems="subnaviItems"></SubnaviVue>
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import SubnaviVue from '@/components/util/Subnavi.vue';
import Loader from '@/components/util/Loader.vue';
import type { SubnaviItem } from '@/components/util/Subnavi.vue';
import { useRepoStore } from '../store/repo';
import { computed } from '@vue/runtime-core';
import { useHashStore } from '@/store/hash';

const repository = computed(() => useRepoStore().currentRepository);
const subnaviItems: SubnaviItem[] = [
    { label: 'modsets', link: '/repo/' + repository.value?.id + '/modsets' },
    { label: 'collections', link: '/repo/' + repository.value?.id + '/collections' },
    { label: 'server.title', link: '/repo/' + repository.value?.id + '/servers' },
];
function checkRepo() {
    if (repository.value === undefined) return;
    useHashStore().addToQueue(repository.value);
}
</script>

<style lang="scss" scoped>
.repo-view {
    position: relative;
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto auto;
        font-size: 22pt;
        align-items: center;
        justify-content: center;
        h1 {
            margin: 0;
            font-style: normal;
            font-weight: bold;
        }
        .icon-group {
            display: grid;
            grid-template-columns: 3rem 3rem;
            align-items: center;
            justify-content: center;
            color: var(--c-text-3);
            .mdi {
                display: inline-flex;
                justify-content: center;
            }
        }
    }
}
</style>
