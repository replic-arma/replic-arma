<template>
    <div class="icon-group">
        <button class="button" v-t="'save'"></button>
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
</template>
<script lang="ts" setup>
import type { Modset } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { onMounted, ref } from 'vue';
import type Ref from 'vue';
import ReplicCheckbox from '../components/util/ReplicCheckbox.vue';
const collection = useRepoStore().currentCollection;
const collectionName = '';
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
});

modsets.value = useRepoStore().currentRepository?.modsets ?? [];
modsets.value.forEach((modset) => {
    modsetMap.value = { [modset.id]: false };
});
</script>
<style lang="scss" scoped>
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
