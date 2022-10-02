<template>
    <Loader v-if="model === null && repository === null" />
    <div class="collection" v-else>
        <div class="collection-mods">
            <div class="collection-mods__modset">
                <span>Modsets</span>
                <ul class="item-group">
                    <li class="item item-modset" v-for="(modset, i) of repository.modsets" :key="i">
                        <CollectionModset :modset="modset" :collection="model" />
                    </li>
                </ul>
            </div>
            <div class="collection-mods__dlc">
                <span>DLC</span>
                <ul class="item-group">
                    <li class="item" v-for="(label, key, index) in dlc" :key="index">
                        <CollectionDLC
                            :label="label"
                            :id="key"
                            :default="model.dlc?.includes(key) ?? false"
                            :open="false"
                            :model="model"
                        />
                    </li>
                </ul>
            </div>
            <!-- <div class="collection-mods__local-mods">
                <span>Local Mods</span>
            </div> -->
        </div>
        <button class="button" @click="saveCollection()" v-t="'save'"></button>
        <div class="collection__modlist" @click="toggle()">
            <span v-t="'show_all_mods'"></span>
            <mdicon v-if="!listOpen" name="chevron-up"></mdicon>
            <mdicon v-if="listOpen" name="chevron-down"></mdicon>
        </div>
        <CollectionModlist
            v-show="Object.keys(model.modsets).length > 0 && listOpen"
            :model="model"
            :repository="repository"
        ></CollectionModlist>
    </div>
</template>

<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { ref, type PropType } from 'vue';
import CollectionModset from '@/components/collection/CollectionModset.vue';
import { notify } from '@kyvg/vue3-notification';
import CollectionDLC from '@/components/collection/CollectionDLC.vue';
import Loader from '@/components/util/Loader.vue';
import CollectionModlist from '@/components/collection/CollectionModlist.vue';
import type { Collection, IReplicArmaRepository } from '@/models/Repository';
const props = defineProps({
    model: {
        type: Object as PropType<Collection>,
        required: true
    },
    repository: {
        type: Object as PropType<IReplicArmaRepository>,
        required: true
    }
});
const dlc = ref({
    contact: 'Contact',
    csla: 'CSLA Iron Curtain',
    GM: 'Global Mobilization - Cold War Germany',
    vn: 'S.O.G. Prairie Fire',
    ws: 'Western Sahara'
});
const listOpen = ref(false);
async function saveCollection() {
    await useRepoStore().save();
    notify({
        title: 'Saved Collection',
        text: `Saved Collection ${props.model.name}`,
        type: 'success'
    });
}

function toggle() {
    listOpen.value = !listOpen.value;
}
</script>

<style lang="scss" scoped>
.collection {
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
            display: flex;
            gap: 1rem;
            align-items: center;
            justify-content: center;
            color: var(--c-text-3);
            .button {
                font-size: 20pt;
            }
        }
    }
    &__modlist {
        position: relative;
        border-top: 1px solid lightgray;
        width: 100%;
        padding-block-start: 1rem;
        margin-block-start: 1rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
    }
}

.collection-mods {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
