<template>
    <ul class="modlist" :class="tree ? 'tree' : 'list'">
        <li
            class="modlist__mod"
            v-for="(modName, index) of orderedMods"
            :key="index"
            :class="[outdated(modName) ? 'outdated' : 'ready']"
        >
            <Tooltip :text="getModSize(modName)" style="grid-column: 1">
                <mdicon v-if="outdated(modName)" name="close" />
                <mdicon v-else name="check" />
                <span>{{ modName }}</span>
            </Tooltip>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import type { ModsetMod } from '@/models/Repository';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { computed } from 'vue';
interface Props {
    mods: Array<string>;
    tree: boolean;
    modsetId: string;
}
const props = defineProps<Props>();
function outdated(modName: string) {
    const cache = useHashStore().cache.find((cache) => cache.id === props.modsetId);
    return (
        cache?.missingFiles.map((filePath: string) => filePath.split('\\').includes(modName)).includes(true) ||
        cache?.outdatedFiles.map((filePath: string) => filePath.split('\\').includes(modName)).includes(true)
    );
}

const orderedMods = computed(() => {
    const unorderedMods = props.mods;
    return unorderedMods.sort((a, b) => a.localeCompare(b));
});

function getModSize(modName: string) {
    const modsetCache = useRepoStore().modsetCache;
    if (modsetCache === null) return '0';
    const cacheData = modsetCache.find((cacheModset) => cacheModset.id === props.modsetId);
    const mod = cacheData?.mods.find((mod: ModsetMod) => mod.name === modName);
    if (mod !== undefined) {
        return mod.size !== undefined ? Number(mod.size / 10e5).toFixed(2) + 'MB' : '0';
    }
    return '0';
}
</script>

<style lang="scss" scoped>
.modlist {
    list-style-type: none;
    padding: 0;
    list-style: none;
    position: relative;
    margin-left: 0.5em;
}
.list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .modlist__mod {
        background: var(--c-surf-3);
        width: fit-content;
        border-radius: 999px;
        padding-inline: 0.5rem;
        padding-block: 0.25rem;
        margin-inline: 0.25rem;
        margin-block: 0.25rem;
    }
}
.tree {
    &:before {
        content: '';
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border-left: 1px solid;
    }

    li {
        margin: 0;
        padding: 0 1.5em; /* indentation + .5em */
        line-height: 2em; /* default list item's `line-height` */
        font-weight: bold;
        position: relative;
    }

    li:before {
        content: '';
        display: block;
        width: 10px; /* same with indentation */
        height: 0;
        border-top: 1px solid;
        margin-top: -1px; /* border top width */
        position: absolute;
        top: 1em; /* (line-height/2) */
        left: 0;
    }

    li:last-child:before {
        background: inherit; /* same with body background */
        height: auto;
        top: 1em; /* (line-height/2) */
        bottom: 0;
    }
}
</style>
