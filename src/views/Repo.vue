<template>
    <div class="repo-view">
        <div class="repo-view__heading" v-if="repository">
            <router-link class="button" to="/"><mdicon name="chevron-left" size="55" /></router-link>
            <h1>{{ repository.name }}</h1>
            <div class="icon-group">
                <mdicon name="refresh" size="45" @click="checkRepo" />
                <router-link class="button" :to="'/reposettings/' + repository.id"
                    ><mdicon name="cog" size="55"
                /></router-link>
            </div>
        </div>
        <subnavi :subnaviItems="subnaviItems"></subnavi>
        <router-view />
    </div>
</template>

<script lang="ts">
import SubnaviVue from '@/components/util/Subnavi.vue';
import type { SubnaviItem } from '@/components/util/Subnavi.vue';
import { Options, Vue } from 'vue-class-component';
import { useRepoStore } from '../store/repo';
import { useDialogStore } from '../store/dialog';
import { mapState } from 'pinia';
@Options({
    components: {
        Subnavi: SubnaviVue,
    },
    computed: {
        ...mapState(useRepoStore, {
            repository: (store) => store.getRepo(store.currentRepoId),
        }),
    },
})
export default class RepoView extends Vue {
    private subnaviItems: SubnaviItem[] = [];
    private repoStore = useRepoStore();
    private dialogStore = useDialogStore();
    private toggleDialog = () => {
        this.dialogStore.toggleDialog('repoSettings');
    };

    public created(): void {
        this.subnaviItems = [
            { label: this.$t('modsets'), link: '/repo/' + this.repoStore.currentRepoId + '/modsets' },
            { label: this.$t('collections'), link: '/repo/' + this.repoStore.currentRepoId + '/collections' },
            { label: this.$t('server.title'), link: '/repo/' + this.repoStore.currentRepoId + '/servers' },
        ];
    }

    public checkRepo(): void {
        const repository = this.repoStore.getRepo(this.repoStore.currentRepoId);
        if (repository !== undefined) repository.calcHash();
    }
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
