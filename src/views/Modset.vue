<template>
    <div class="modset" v-if="modset !== undefined">
        <div class="modset__heading">
            <Tooltip text="Go Back">
                <mdicon name="chevron-left" size="45" @click="$router.back()" />
            </Tooltip>
            <h1>{{ modset?.name }}</h1>
            <div class="icon-group">
                <template v-if="status === 'downloading'">
                    <Status :status="status" :progress="progress"></Status>
                </template>
                <template v-if="status === 'outdated'">
                    <button class="button" @click="download()">
                        <mdicon name="download"></mdicon>
                        Download
                    </button>
                </template>
                <template v-if="status === 'ready'">
                    <button class="button" @click="play()" v-t="'play'">
                        <mdicon name="play"></mdicon>
                    </button>
                </template>
            </div>
        </div>
        <!-- <pre>
            Size: {{ size }} GB 
            Files: {{ files }}
            Update Size {{ updateSize }}
            Update Files {{ updateFiles.length }}
            Files {{ updateFiles }}
        </pre> -->
        <ul class="modset__mods">
            <li v-for="(mod, i) of modset?.mods" :key="i">
                <Tooltip :text="getModSize(mod.name)" style="grid-column: 1">
                    <div class="modset__mod" :class="[outdated(mod) ? 'outdated' : 'ready']">
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
import type { ModsetMod } from '@/models/Repository';
import { useHashStore } from '@/store/hash';
import type { IHashItem } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { computed, ref } from 'vue';
import { useDownloadStore } from '@/store/download';
import { launchModset } from '@/util/system/game';
import Status from '../components/util/Status.vue';
import { notify } from '@kyvg/vue3-notification';
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

function getModSize(modName: string) {
    const modsetCache = useRepoStore().modsetCache;
    if (modsetCache === null) return '0';
    const cacheData = modsetCache.find((cacheModset) => cacheModset.id === modset?.id);
    const mod = cacheData?.mods.find((mod: ModsetMod) => mod.name === modName);
    if (mod !== undefined) {
        return mod.size !== undefined ? Number(mod.size / 10e5).toFixed(2) + 'MB' : '0';
    }
    return '0';
}

function play() {
    if (modset === undefined) return;
    launchModset(modset.id, useRouteStore().currentRepoID ?? '');
}

const updateSize = computed(() => {
    const modsetCache = useRepoStore().modsetCache;
    const cacheDataa = useHashStore().cache.find((cacheModset) => cacheModset.id === modset?.id);
    if (modsetCache === null || cacheDataa === null) return 0;
    const cacheData = modsetCache.find((cacheModset) => cacheModset.id === modset?.id);
    const filesToDownload = [...(cacheDataa?.missingFiles as string[]), ...(cacheDataa?.outdatedFiles as string[])];
    const mods =
        cacheData?.mods
            .flatMap((mod: ModsetMod) => mod.files ?? [])
            .filter((file) => filesToDownload.includes(file.path)) ?? [];
    return Number(
        mods.reduce((previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size, 0) /
            10e8
    ).toFixed(2);
});

const updateFiles = computed(() => {
    const cacheDataa = useHashStore().cache.find((cacheModset) => cacheModset.id === modset?.id);
    if (cacheDataa === null) return [];

    const filesToDownload = [...(cacheDataa?.missingFiles as string[]), ...(cacheDataa?.outdatedFiles as string[])];

    return filesToDownload;
});

const status = computed(() => {
    const cacheData = useHashStore().cache.find((cacheModset) => cacheModset.id === modset?.id);
    if (cacheData === undefined) return 'checking';
    if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === modset!.id) return 'downloading';
    if (cacheData.outdatedFiles.length > 0 || cacheData.missingFiles.length > 0) {
        return 'outdated';
    } else {
        return 'ready';
    }
});

const progress = computed(() => {
    if (
        useDownloadStore().current !== null &&
        useDownloadStore().current?.item.id === useRepoStore().currentModset?.id
    ) {
        return Number(
            Number(
                (useDownloadStore().current!.received / 10e5 / (useDownloadStore().current!.size / 10e8)) * 100
            ).toFixed(0)
        );
    } else {
        if (useHashStore().current === null || useHashStore().current?.repoId !== useRouteStore().currentRepoID)
            return 0;
        const { checkedFiles, filesToCheck } = useHashStore().current as IHashItem;
        return Math.floor((checkedFiles / filesToCheck) * 100);
    }
});
function download() {
    if (modset === undefined) return;
    useDownloadStore().addToDownloadQueue(modset, useRouteStore().currentRepoID ?? '');
    notify({
        title: 'Added Modset to queue',
        text: `Modset ${modset?.name} has been added to the download queue`,
        type: 'success',
    });
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
        font-size: 14pt;
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
<style>
.outdated svg {
    fill: red;
}
.ready svg {
    fill: green;
}
</style>
