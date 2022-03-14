<template>
    <div class="general-repo-settings">
        <div class="txt">
            <label for="repoName">{{ $t('repository.name') }}</label>
            <div class="txt__input-wrapper" v-if="repository">
                <input class="txt__input" type="text" name="repoName" v-model="repository.name" />
            </div>
        </div>
        <div class="txt">
            <label for="repoName">{{ $t('repository.autoconfig') }}</label>
            <div class="txt__input-wrapper">
                <input class="txt__input" type="text" name="repoName" />
            </div>
        </div>
        <button class="button" type="button" @click="removeRepo">{{ $t('remove') }}</button>
    </div>
</template>
<script lang="ts">
import { ReplicArmaRepository } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';
import ReplicPathSelectorVue from '../util/ReplicPathsSelector.vue';
import Toast from '../util/Toast';
@Options({
    components: {
        ReplicPathSelector: ReplicPathSelectorVue,
    },
})
export default class GeneralRepoVue extends Vue {
    private repoStore = useRepoStore();
    private repository!: ReplicArmaRepository | undefined;

    public created(): void {
        this.repository = this.repoStore.getRepo(this.repoStore.currentRepoId);
    }

    public removeRepo(): void {
        this.repoStore.removeRepo(this.repoStore.currentRepoId);
        this.$router.push('/');
        Toast('Removed Repository ' + this.repository?.name);
    }
}
</script>
<style lang="scss" scoped>
.general-repo-settings {
    display: grid;
    row-gap: 1.5rem;
    grid-template-columns: 1fr;
}
</style>
