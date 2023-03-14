<template>
    <Loader v-if="loading" />
    <div v-else-if="repository === null">
        <span v-t="'empty_states.repository_not_found.title'"></span>
    </div>
    <div class="settings-view" v-else>
        <div class="settings-view__heading">
            <Tooltip text="Go Back">
                <router-link class="button" :to="`/repo/${repository.id}/modsets`"
                    ><mdicon name="chevron-left" size="45"
                /></router-link>
            </Tooltip>
            <h1>{{ repository.name }}</h1>
        </div>
        <SubnaviVue :subnaviItems="subnaviItems"></SubnaviVue>
        <router-view :model="repository" />
    </div>
</template>

<script lang="ts" setup>
import Loader from '@/components/util/Loader.vue';
import SubnaviVue from '@/components/util/Subnavi.vue';
import { useRepository } from '@/composables/useRepository';
import { useRouteStore } from '@/store/route';
import { computed } from '@vue/runtime-core';
const { repository, loading } = useRepository(useRouteStore().currentRepoID ?? '');
const subnaviItems = computed(() => {
    return [
        { label: 'general', link: `/repo-settings/${repository.value?.id}/general` },
        { label: 'launch_options', link: `/repo-settings/${repository.value?.id}/launch` }
    ];
});
</script>

<style lang="scss" scoped>
.settings-view {
    position: relative;
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr;
        font-size: 16pt;
        align-items: center;
        justify-content: center;
        h1 {
            margin: 0;
            font-style: normal;
            font-weight: bold;
        }
    }
}
</style>
