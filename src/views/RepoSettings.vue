<template>
    <div class="repo-settings">
        <div class="repo-settings__heading">
            <router-link class="button" :to="'/repo/' + useRouteStore().currentRepoID + '/modsets'"
                ><mdicon name="chevron-left" size="55"
            /></router-link>
            <h1>Settings</h1>
        </div>
        <RepoSettings></RepoSettings>
    </div>
</template>

<script lang="ts" setup>
import LaunchVue from '@/components/settings/Launch.vue';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { shallowRef } from 'vue';

const repository = useRepoStore().currentRepository;

</script>

<style lang="scss">
.repo-settings {
    position: relative;
    &__heading {
        display: grid;
        grid-template-columns: 4rem max-content 4rem 1fr;
        font-size: 22pt;
        align-items: center;
        justify-content: center;

        h1 {
            margin: 0;
            font-weight: bold;
            color: #333333;
        }
    }
}
</style>
