<template>
    <div class="modset" v-if="modset !== undefined">
        <div class="modset__heading">
            <mdicon name="chevron-left" size="55" @click="$router.back()" />
            <h1>{{ modset?.name }}</h1>
            <div class="icon-group">
                <span class="repo__status" :class="`status--${status}`">
                    <template v-if="status === 'checking' || status === 'updating'">
                        <mdicon name="loading" spin />
                    </template>
                    <span v-t="'download-status.' + status"></span>
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
        <p>Size: {{ size }}GB Files: {{ files }}</p>
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

<script lang="ts" setup>
import TooltipVue from '@/components/util/Tooltip.vue';
import type { File, Modset, ModsetMod } from '@/models/Repository';
import { useHashStore } from '@/store/hash';
import type { IHashItem } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { computed, ref } from 'vue';
import { useDownloadStore } from '@/store/download';
const modset = useRepoStore().currentModset;
const files = ref(0);
const size = computed(() => {
    const modsetCache = useRepoStore().modsetCache;
    if (modsetCache === null) return 0;
    const cacheData = modsetCache.find((cacheModset) => cacheModset.id === modset?.id);
    const mods = cacheData?.mods.flatMap((mod: ModsetMod) => mod.files ?? []) ?? [];
    files.value = mods.length;
    return Number(
        mods.reduce((previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size, 0) /
            10e8
    ).toFixed(2);
});
const status = computed(() => {
    const cacheData = useHashStore().cache.find((cacheModset) => cacheModset.id === modset?.id);
    if (cacheData === undefined) return 'checking';
    if (cacheData.outdatedFiles.length > 0 || cacheData.missingFiles.length > 0) {
        return 'outdated';
    } else {
        return 'ready';
    }
});
const progress = computed(() => {
    if (useHashStore().current === null || useHashStore().current?.repoId !== useRouteStore().currentRepoID) return 0;
    const { checkedFiles, filesToCheck } = useHashStore().current as IHashItem;
    return Math.floor((checkedFiles / filesToCheck) * 100);
});
function download() {
    if (modset === undefined) return;
    useDownloadStore().addToDownloadQueue(modset, useRouteStore().currentRepoID ?? '');
}

function outdated(mod: ModsetMod) {
    const cache = useHashStore().cache.find((cache) => cache.id === modset?.id);
    return (
        cache?.missingFiles.map((filePath: string) => filePath.split('\\').includes(mod.name)).includes(true) ||
        cache?.outdatedFiles.map((filePath: string) => filePath.split('\\').includes(mod.name)).includes(true)
    );
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
