<template>
    <Loader v-if="loading" />
    <div v-else-if="repository === null">
        <span v-t="'empty_states.repository_not_found.title'"></span>
    </div>
    <div class="repo-view" v-else>
        <div class="repo-view__heading">
            <Tooltip text="Go Back">
                <router-link class="button" to="/"><mdicon name="chevron-left" size="45" /></router-link>
            </Tooltip>
            <h1>{{ repository.name }}</h1>
            <div class="icon-group">
                <Tooltip text="Share Repository">
                    <mdicon name="share" size="35" @click="shareRepository()" />
                </Tooltip>
                <Tooltip text="Downloads" position="bottom">
                    <Downloads />
                </Tooltip>
                <Tooltip text="Refresh Repository">
                    <mdicon name="refresh" size="35" @click="recalcRepository()" />
                </Tooltip>
                <Tooltip text="Settings">
                    <router-link :to="`/repo-settings/${repository.id}/general`">
                        <mdicon name="cog" role="button" size="35"></mdicon>
                    </router-link>
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
import Downloads from '@/components/Download/Downloads.vue';
import { useRepository } from '@/composables/useRepository';
import { useRouteStore } from '@/store/route';
import { useDeepLink } from '@/composables/useDeepLink';
import { notify } from '@kyvg/vue3-notification';
import { writeTextClipboard } from '@/util/system/clipboard';
const { repository, recalcRepository, loading } = useRepository(useRouteStore().currentRepoID ?? '');
const subnaviItems = computed(() => {
    const items = [
        { label: 'modsets', link: `/repo/${repository.value?.id}/modsets` },
        { label: 'collections', link: `/repo/${repository.value?.id}/collections` }
    ];
    if (repository.value?.game_servers !== undefined && repository.value?.game_servers?.length > 0) {
        items.push({ label: 'server.title', link: `/repo/${repository.value?.id}/servers` });
    }

    return items;
});

function shareRepository() {
    const { createDeepLink } = useDeepLink();
    if (repository.value === null) return;
    writeTextClipboard(createDeepLink(repository.value));
    notify({
        title: 'Copied Share link',
        text: `The link has been copied to your clipboard`,
        type: 'success'
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
            grid-template-columns: 3rem 3rem 3rem 3rem;
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
