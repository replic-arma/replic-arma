<template>
    <div class="collection">
        <template v-if="collection !== undefined && repository !== undefined">
            <div class="collection__heading">
                <Tooltip text="Go Back">
                    <mdicon name="chevron-left" size="45" @click="goToRepo()" />
                </Tooltip>
                <h1>{{ collection.name }}</h1>
                <div class="icon-group">
                    <button class="button" v-t="'play'" @click="play()"></button>
                    <button class="button" v-t="'save'" @click="saveCollection()"></button>
                </div>
            </div>

            <div class="collection-mods">
                <div class="collection-mods__modset">
                    <span>Modsets</span>
                    <ul class="item-group">
                        <li class="item item-modset" v-for="(modset, i) of repository.modsets" :key="i">
                            <CollectionModset :modset="modset" :collection="collection" />
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
                                :default="collection.dlc?.includes(key) ?? false"
                                :open="false"
                            />
                        </li>
                    </ul>
                </div>
                <!-- <div class="collection-mods__local-mods">
                <span>Local Mods</span>
            </div> -->
            </div>
            <Modlist v-if="collection.modsets"></Modlist>
        </template>
        <Loader v-else />
    </div>
</template>

<script lang="ts" setup>
import { useRepoStore } from '@/store/repo';
import { useRouteStore } from '@/store/route';
import { ref, computed } from 'vue';
import CollectionModset from '../components/collection/CollectionModset.vue';
import { launchCollection } from '@/util/system/game';
import { notify } from '@kyvg/vue3-notification';
import Modlist from '../components/Modlist.vue';
import CollectionDLC from '../components/collection/CollectionDLC.vue';
import { useRouter } from 'vue-router';
import Loader from '../components/util/Loader.vue';
const collection = computed(() => useRepoStore().currentCollection);
const repository = computed(() => useRepoStore().currentRepository);
const dlc = ref({
    contact: 'Contact',
    csla: 'CSLA Iron Curtain',
    GM: 'Global Mobilization - Cold War Germany',
    vn: 'S.O.G. Prairie Fire',
    ws: 'Western Sahara',
});
const router = useRouter();
async function saveCollection() {
    await useRepoStore().save();
    notify({
        title: 'Saved Collection',
        text: `Saved Collection ${collection.value!.name}`,
        type: 'success',
    });
}

async function play() {
    if (useRepoStore().currentCollection === undefined) return;
    await launchCollection(useRepoStore().currentCollection!, useRouteStore().currentRepoID ?? '');
}

function goToRepo() {
    router.push('/repo/' + useRouteStore().currentRepoID + '/collections');
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
