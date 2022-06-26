<template>
    <div class="collection" v-if="collection !== undefined">
        <div class="collection__heading">
            <mdicon name="chevron-left" size="55" @click="$router.back()" />
            <h1>{{ collection.name }}</h1>
            <div class="icon-group">
                <button class="button" v-t="'play'"></button>
                <button class="button" v-t="'save'" @click="saveCollection()"></button>
            </div>
        </div>

        <div class="collection-mods">
            <div class="collection-mods__modset">
                <span>Modsets</span>
                <ul class="item-group">
                    <li class="item item-modset" v-for="(modset, i) of modsets" :key="i">
                        <ReplicCheckbox :label="modset.name" v-model="modsetMap[modset.id]" />
                    </li>
                </ul>
            </div>
            <div class="collection-mods__dlc">
                <span>DLC</span>
                <ul class="item-group">
                    <li class="item" v-for="(dlc, i) of dlc" :key="i">
                        <ReplicCheckbox :label="dlc" v-model="dlcMap[i]" />
                    </li>
                </ul>
            </div>
            <div class="collection-mods__local-mods">
                <span>Local Mods</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { SubnaviItem } from '@/components/util/Subnavi.vue';
import type { Modset } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { ref, toRaw } from 'vue';
import Subnavi from '../components/util/Subnavi.vue';
import ReplicCheckbox from '../components/util/ReplicCheckbox.vue';
const collection = useRepoStore().currentCollection;
const modsets = ref([] as Modset[]);
const dlc = ref({
    aow: 'Art of War',
    apex: 'Apex',
    contact: 'Contact',
    csla: 'CSLA Iron Curtain',
    gm: 'Global Mobilization - Cold War Germany',
    helicopters: 'Helicopters',
    jets: 'Jets',
    karts: 'Karts',
    'laws-of-war': 'Laws of War',
    marksmen: 'Marksmen',
    'tac-ops': 'Tac Ops',
    tanks: 'Tanks',
    vn: 'S.O.G. Prairie Fire',
    ws: 'Western Sahara',
});

const modsetMap = ref({} as { [key: string]: boolean });

const dlcMap = ref({
    aow: false,
    apex: false,
    contact: false,
    csla: false,
    gm: false,
    helicopters: false,
    jets: false,
    karts: false,
    'laws-of-war': false,
    marksmen: false,
    'tac-ops': false,
    tanks: false,
    vn: false,
    ws: false,
} as { [key: string]: boolean });

modsets.value = useRepoStore().currentRepository?.modsets ?? [];
modsets.value.forEach((modset) => {
    modsetMap.value = { ...modsetMap.value, ...{ [modset.id]: collection?.modsets?.includes(modset.id) ?? false } };
});

for (const [k, v] of Object.entries(dlcMap.value)) {
    if (collection?.dlc?.includes(k)) {
        dlcMap.value[k] = true;
    }
}

function saveCollection() {
    const modsets = [];
    const dlc = [];
    if (collection !== undefined && collection?.dlc === undefined) collection.dlc = [];
    for (const [k, v] of Object.entries(toRaw(dlcMap.value))) {
        if (v) {
            dlc.push(k);
        }
    }
    if (collection !== undefined && collection?.modsets === undefined) collection.modsets = [];
    for (const [k, v] of Object.entries(toRaw(modsetMap.value))) {
        if (v) {
            modsets.push(k);
        }
    }
    if (collection !== undefined) {
        collection.modsets = modsets;
        collection.dlc = dlc;
    }

    useRepoStore().save();
}
</script>

<style lang="scss" scoped>
.collection {
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
            .button {
                font-size: 20pt;
            }
        }
    }
}

.collection-mods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    .item-group {
        padding: 0;
        list-style-type: none;
        gap: 0.75rem;
        display: flex;
        flex-direction: column;
        .item {
            block-size: 3rem;
            display: flex;
            border-radius: 0.5rem;
            align-items: center;
            padding-inline: 0.75rem;
            &:hover {
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
            }
        }
    }
}
</style>
