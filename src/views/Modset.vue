<template>
    <div class="modset">
        <div class="modset__heading">
            <Tooltip text="Go Back">
                <mdicon name="chevron-left" size="45" @click="$router.back()" />
            </Tooltip>
            <h1 v-if="modset !== undefined">{{ modset?.name }}</h1>
            <div class="icon-group" v-if="modset !== undefined">
                <Tooltip text="Downloads" position="bottom">
                    <Downloads />
                </Tooltip>
                <template v-if="status === 'downloading'">
                    <Status :status="status" :progress="progress"></Status>
                </template>
                <template v-if="status === 'outdated'">
                    <button class="button" @click="download()">
                        <mdicon name="download"></mdicon>
                        <span v-t="'download'"></span>
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
        <Subnavi v-if="modset !== undefined" :subnaviItems="subnaviItems"></Subnavi>
        <router-view />
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
import Downloads from '../components/download/Downloads.vue';
import Subnavi from '../components/util/Subnavi.vue';
const modset = computed(() => useRepoStore().currentModset);
const subnaviItems = computed(() => {
    return [
        {
            label: 'mods',
            link: `/repo/${useRouteStore().currentRepoID}/modset/${useRouteStore().currentModsetID}/mods`,
        },
    ];
});
const files = ref(0);
const size = computed(() => {
    const modsetCache = useRepoStore().modsetCache;
    if (modsetCache === null || modset.value === undefined) return 0;
    const cacheData = modsetCache.find((cacheModset) => cacheModset.id === modset.value!.id);
    const mods = cacheData?.mods.flatMap((mod: ModsetMod) => mod.files ?? []) ?? [];
    return Number(
        mods.reduce((previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size, 0) /
            10e8
    ).toFixed(2);
});

function play() {
    if (modset.value === undefined) return;
    launchModset(modset.value.id, useRouteStore().currentRepoID ?? '');
}

const updateSize = computed(() => {
    const modsetCache = useRepoStore().modsetCache;
    const cacheDataa = useHashStore().cache.find((cacheModset) => cacheModset.id === modset.value!.id);
    if (modsetCache === null) return 0;
    const cacheData = modsetCache.find((cacheModset) => cacheModset.id === modset.value!.id);
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
    const cacheDataa = useHashStore().cache.find((cacheModset) => cacheModset.id === modset.value!.id);
    if (cacheDataa === null) return [];

    const filesToDownload = [...(cacheDataa?.missingFiles as string[]), ...(cacheDataa?.outdatedFiles as string[])];

    return filesToDownload;
});

const status = computed(() => {
    const cacheData = useHashStore().cache.find((cacheModset) => cacheModset.id === modset.value!.id);
    if (cacheData === undefined) return 'checking';
    if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === modset.value!.id)
        return 'downloading';
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
    if (modset.value === undefined) return;
    useDownloadStore().addToDownloadQueue(modset.value, useRouteStore().currentRepoID ?? '');
    notify({
        title: 'Added Modset to queue',
        text: `Modset ${modset.value.name} has been added to the download queue`,
        type: 'success',
    });
}
</script>

<style lang="scss" scoped>
.modset {
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto;
        font-size: 16pt;
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
            display: grid;
            grid-template-columns: 3rem 1fr;
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
        padding-inline: 1rem;
        padding-block: 0.25rem;
        margin-inline: 0.25rem;
        margin-block: 0.25rem;
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
