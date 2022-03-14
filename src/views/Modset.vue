<template>
    <div class="modset">
        <div class="modset__heading">
            <mdicon name="chevron-left" size="55" @click="$router.back()" />
            <h1>{{ modset?.name }}</h1>
            <div class="icon-group">
                <span class="repo__status" :class="`status--${status}`">
                    <template v-if="status === 'checking' || status === 'updating'">
                        <mdicon name="loading" spin />
                    </template>
                    {{ $t('download-status.' + status) }}
                    <template v-if="status === 'checking' || (status === 'updating' && progress !== 0)">
                        <span>...{{ progress }}%</span>
                    </template>
                </span>
                <template v-if="status === 'outdated'">
                    <button class="button" @click="download()">
                        <mdicon name="download" />
                        Download
                    </button>
                </template>
                <template v-if="status === 'downloading'">
                    <button class="button">
                        <mdicon name="download" @click="download()" />
                        <mdicon name="play" />
                        <span v-if="status === 'downloading'" class="spinner spinner-spin" />
                    </button>
                </template>

                <!-- <mdicon @click="toggleDialog" name="cog" size="55" /> -->
            </div>
        </div>
        <ul class="modset__mods">
            <li v-for="(mod, i) of modset?.mods" :key="i">
                <Tooltip :text="mod.size" style="grid-column: 1">
                    <div class="modset__mod">
                        {{ mod.name }}
                        <template v-if="outdated(mod)">
                            <mdicon name="close" />
                        </template>
                        <template v-else>
                            <mdicon name="check" />
                        </template>
                    </div>
                </Tooltip>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import TooltipVue from '@/components/util/Tooltip.vue';
import type { ModsetMod } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { mapState } from 'pinia';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Tooltip: TooltipVue,
    },
    computed: {
        ...mapState(useRepoStore, {
            modset: (store) => store.getModset(store.currentRepoId, store.currentModsetId),
        }),
    },
})
export default class ModsetView extends Vue {
    private repoStore = useRepoStore();
    private hashStore = useHashStore();
    private downloadStore = useDownloadStore();
    private get status() {
        return this.repoStore.getModsetStatus(this.repoStore.currentModsetId);
    }

    private get progress() {
        const hashStore = useHashStore();
        if (hashStore.current === null || hashStore.current.repoId !== this.repoStore.currentRepoId) return 0;
        return Math.floor((hashStore.current.checkedFiles / hashStore.current.filesToCheck) * 100);
    }

    private outdated(mod: ModsetMod) {
        const cache = this.hashStore.cache.get(this.repoStore.currentModsetId ?? '');
        return (
            cache?.missingFiles.map((file) => file.split('\\').includes(mod.name)).includes(true) ||
            cache?.outdatedFiles.map((file) => file.split('\\').includes(mod.name)).includes(true)
        );
    }

    private download() {
        const modset = this.repoStore.getModset(this.repoStore.currentRepoId, this.repoStore.currentModsetId);
        const repo = this.repoStore.getRepo(this.repoStore.currentRepoId);
        if (modset === undefined || repo === undefined) return;
        this.downloadStore.addToDownloadQueue(modset, repo?.id);
    }
}
</script>

<style lang="scss" scoped>
.modset {
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto;
        font-size: 22pt;
        align-items: center;
        justify-content: center;
        span {
            cursor: pointer;
        }
        h1 {
            margin: 0;
            font-weight: bold;
            color: #333333;
        }
        .icon-group {
            align-items: center;
            justify-content: center;
            color: var(--c-text-3);
            span {
                cursor: pointer;
            }
            .mdi {
                display: inline-flex;
                justify-content: center;
            }
        }
    }

    &__mods {
        display: flex;
        flex-flow: row wrap;
        list-style-type: none;
    }

    &__mod {
        background: var(--c-surf-3);
        width: fit-content;
        border-radius: 999px;
        padding-inline: var(--space-md);
        padding-block: var(--space-xs);
        margin-inline: var(--space-xs);
        margin-block: var(--space-xxs);
    }
}
</style>
