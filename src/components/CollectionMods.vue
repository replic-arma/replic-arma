<template>
    <div class="collection-mods">
        <div class="collection-mods__modset">
            <span>Modsets</span>
            <ul class="item-group">
                <li class="item item-modset" v-for="(modset, i) of repoStore.getModsets(repoStore.currentRepoId)" :key="i">
                    <div class="replic-checkbox">
                        <input type="checkbox" :id="'check-'+ i">
                        <label class="" :for="'check-'+ i"><span>{{modset.name}}</span></label>
                    </div>
                </li>
            </ul>
        </div>
        <div class="collection-mods__dlc">
            <span>DLC</span>
            <ul class="item-group">
                <li class="item" v-for="(dlc, i) of dlc" :key="i">
                    <div class="replic-checkbox">
                        <input type="checkbox" :id="'check-'+ i">
                        <label class="" :for="'check-'+ i"><span>{{dlc}}</span></label>
                    </div>
                </li>
            </ul>
        </div>
        <div class="collection-mods__local-mods">
            <span>Lokale Mods</span>
        </div>
    </div>
</template>
<script lang="ts">
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
@Options({
    components: {
        ReplicDialog: ReplicDialogVue
    }
})
export default class CollectionMods extends Vue {
    private collectionName: string|undefined;
    private repoStore = useRepoStore();
    private dlc = {
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
        ws: 'Western Sahara'
    };
}
</script>
<style lang="scss" scoped>
.collection-mods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    .item-group {
        padding: 0;
        list-style-type: none;
        gap: .75rem;
        display: flex;
        flex-direction: column;
        .item {
            block-size: 3rem;
            display: flex;
            border-radius: .5rem;
            align-items: center;
            padding-inline: .75rem;
            &:hover {
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
            }
        }
    }
}

.replic-checkbox {
    input[type=checkbox] {
        display: none;
    }

    input[type=checkbox]:checked ~ div {
     display: block;
    }

    label {
        display: flex;
        align-items: center;
    }
    span {
        margin-inline-start: 1rem;
    }
    label::before {
        content: "";
        block-size: 2rem;
        inline-size: 2rem;
        border-radius: 2rem;
        background: white;
        display: inline-flex;
    }

    input[type=checkbox]:checked ~ label::before {
        content: "";
    }
}
</style>
