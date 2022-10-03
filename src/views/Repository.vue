<template>
    <Loader v-if="loading" />
    <div v-else-if="repository === null">
        <span>Could not load repository</span>
    </div>
    <div class="repo-view" v-else>
        <div class="repo-view__heading">
            <Tooltip text="Go Back">
                <router-link class="button" to="/"><mdicon name="chevron-left" size="45" /></router-link>
            </Tooltip>
            <h1>{{ repository.name }}</h1>
            <div class="icon-group">
                <Tooltip text="Downloads" position="bottom">
                    <Downloads />
                </Tooltip>
                <Tooltip text="Refresh Repository">
                    <mdicon name="refresh" size="35" @click="recalcRepository()" />
                </Tooltip>
                <Tooltip text="Settings">
                    <Settings :modelValue="repository"></Settings>
                </Tooltip>
            </div>
        </div>
        <SubnaviVue :subnaviItems="subnaviItems"></SubnaviVue>
        <router-view :model="repository" />
    </div>
</template>

<script lang="ts" setup>
import SubnaviVue from '@/components/util/Subnavi.vue';
import Loader from '@/components/util/Loader.vue';
import { computed } from '@vue/runtime-core';
import Settings from '@/components/Repository/Settings.vue';
import Downloads from '@/components/download/Downloads.vue';
import { useRepository } from '@/composables/useRepository';
import { useRouteStore } from '@/store/route';
const { repository, recalcRepository, loading } = useRepository(useRouteStore().currentRepoID ?? '');
const subnaviItems = computed(() => {
    return [
        { label: 'modsets', link: '/repo/' + repository.value?.id + '/modsets' },
        { label: 'collections', link: '/repo/' + repository.value?.id + '/collections' },
        { label: 'server.title', link: '/repo/' + repository.value?.id + '/servers' }
    ];
});
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