<template>
    <Loader v-if="loading" />
    <div v-else-if="modset === null">
        <span v-t="'empty_states.modset_not_found.title'"></span>
    </div>
    <div class="modset" v-else>
        <div class="modset__heading">
            <Tooltip text="Go Back">
                <mdicon name="chevron-left" size="45" @click="$router.back()" />
            </Tooltip>
            <h1 v-if="modset !== undefined">{{ modset?.name }}</h1>
            <div class="icon-group" v-if="modset !== undefined">
                <Tooltip text="Downloads" position="bottom">
                    <Downloads />
                </Tooltip>
                <template v-if="status === DownloadStatus.DOWNLOADING || status === HashStatus.CHECKING">
                    <Status :status="status" :progress="progress"></Status>
                </template>
                <template v-if="status === 'outdated'">
                    <button class="button" @click="downloadModset()">
                        <mdicon name="download"></mdicon>
                        <span v-t="'download'"></span>
                    </button>
                </template>
                <template v-if="status === HashStatus.READY">
                    <button class="button" @click="playModset()" v-t="'play'">
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
        <router-view :model="modset" />
    </div>
</template>

<script lang="ts" setup>
import { useRouteStore } from '@/store/route';
import { computed } from 'vue';
import Status from '@/components/util/Status.vue';
import Downloads from '@/components/download/Downloads.vue';
import Subnavi from '@/components/util/Subnavi.vue';
import { useModset } from '@/composables/useModset';
import { DownloadStatus } from '@/models/Download';
import { HashStatus } from '@/models/Repository';
import Loader from '@/components/util/Loader.vue';
const { modset, status, progress, downloadModset, size, updateFiles, files, updateSize, playModset, loading } =
    useModset(useRouteStore().currentRepoID ?? '', useRouteStore().currentModsetID ?? '');

const subnaviItems = computed(() => {
    return [
        {
            label: 'mods',
            link: `/repo/${useRouteStore().currentRepoID}/modset/${useRouteStore().currentModsetID}/mods`
        }
    ];
});
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
