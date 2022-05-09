<template>
    <div class="general-repo-settings">
        <div class="txt">
            <label for="repoName" v-t="'repository.name'"></label>
            <div class="txt__input-wrapper" v-if="repository">
                <input class="txt__input" type="text" name="repoName" v-model="repository.name" />
            </div>
        </div>
        <div class="txt">
            <label for="repoName" v-t="'repository.autoconfig'"></label>
            <div class="txt__input-wrapper">
                <input class="txt__input" type="text" name="repoName" />
            </div>
        </div>
        <button class="button" type="button" @click="removeRepo" v-t="'remove'"></button>
    </div>
</template>
<script lang="ts" setup>
import type { IReplicArmaRepository } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';
import ReplicPathSelectorVue from '../util/ReplicPathsSelector.vue';
import Toast from '../util/Toast';
const repository = useRepoStore().currentRepository;
function removeRepo(): void {
    useRepoStore().repos =
        useRepoStore().repos?.filter((repo: IReplicArmaRepository) => repo.id !== repository?.id) ?? [];
    useRepoStore().save();
    Toast('Removed Repository ' + repository?.name);
}
</script>
<style lang="scss" scoped>
.general-repo-settings {
    display: grid;
    row-gap: 1.5rem;
    grid-template-columns: 1fr;
}
</style>
