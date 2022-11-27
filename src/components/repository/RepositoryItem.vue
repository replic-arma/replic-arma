<template>
    <li class="repo">
        <img class="repo__img" v-once :src="repository.image" />
        <span class="repo__name" v-once>{{ repository.name }}</span>
        <div class="repo__status">
            <Status :status="status" :progress="progress"></Status>
        </div>
        <div class="repo__modset">
            <select v-model="currentModsetId">
                <optgroup label="------Modsets-------">
                    <option v-once v-for="(modset, i) of repository.modsets" :key="i" :value="modset.id + '_1'">
                        {{ modset.name }}
                    </option>
                </optgroup>
                <optgroup label="------Collections------" v-if="repository.collections.length > 0">
                    <option
                        v-once
                        v-for="(collection, i) of repository.collections"
                        :key="i"
                        :value="collection.id + '_2'"
                    >
                        {{ collection.name }}
                    </option>
                </optgroup>
            </select>
        </div>
        <PlayButton @play="play()"></PlayButton>
        <router-link v-once :to="'/repo/' + repository.id + '/modsets'" class="repo__open button">
            <mdicon name="folder-open-outline"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts" setup>
import { useHashStore } from '@/store/hash';
import type { IHashItem } from '@/store/hash';
import { computed, onMounted, ref } from 'vue';
import Status from '../util/Status.vue';
import { launchModset } from '@/util/system/game';
import { HashStatus, type Collection, type IReplicArmaRepository } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import PlayButton from '../PlayButton.vue';

interface Props {
    repository: IReplicArmaRepository;
}
const props = defineProps<Props>();
const status = computed(() => {
    const [id, type] = currentModsetId.value.split('_');
    if (type === '1') {
        const cacheData = useHashStore().cache.find(cacheModset => cacheModset.id === id);
        if (cacheData === undefined) return HashStatus.CHECKING;
        if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === id)
            return useDownloadStore().current?.status;
        if (cacheData.outdated.length > 0 || cacheData.missing.length > 0) {
            return HashStatus.OUTDATED;
        }
    } else {
        const collection = props.repository.collections.find((collection: Collection) => collection.id === id);
        const cacheData = useHashStore().cache.find(cacheModset => cacheModset.id === props.repository.id);
        if (cacheData === undefined) return HashStatus.CHECKING;
        if (cacheData.outdated.length > 0 || cacheData.missing.length > 0) {
            return HashStatus.OUTDATED;
        }
        if (collection !== undefined) {
            for (const modsetId of Object.keys(collection.modsets)) {
                if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === modsetId)
                    return useDownloadStore().current?.status;
            }
        }
    }
    return HashStatus.READY;
});

const progress = computed(() => {
    const [id] = currentModsetId.value.split('_');
    if (useDownloadStore().current !== null && useDownloadStore().current?.item.id === id) {
        return +Number(
            (useDownloadStore().current!.received / 10e5 / (useDownloadStore().current!.size / 10e8)) * 100
        ).toFixed(0);
    } else {
        if (useHashStore().current === null || useHashStore().current?.repoId !== props.repository.id) return 0;
        const { checkedFiles, filesToCheck } = useHashStore().current as IHashItem;
        return Math.floor((checkedFiles / filesToCheck) * 100);
    }
});

onMounted(() => {
    if (props.repository.modsets.length === 0 || props.repository.modsets[0] == null) return '';
    currentModsetId.value = props.repository.modsets[0].id + '_1' ?? '';
});
function play() {
    const [id] = currentModsetId.value.split('_');
    if (id === undefined) return '';
    launchModset(id, props.repository.id);
}
const currentModsetId = ref('');
</script>
<style lang="scss" scoped>
.repo {
    block-size: 5rem;
    inline-size: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 5rem 1fr 0.5fr 0.5fr 0.5fr 10%;

    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: var(--shadow-1);
    border-radius: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        // box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__img {
        padding-inline-start: 1rem;
        block-size: 3rem;
    }

    &__name {
        font-weight: bold;
        font-size: 14pt;
    }

    &__status {
        text-align: left;
    }

    &__open {
        cursor: pointer;
        background-color: var(--c-surf-3);
        inline-size: 0;
        justify-self: flex-end;
        block-size: 100%;
        inline-size: 100%;
        border-top-right-radius: inherit;
        border-bottom-right-radius: inherit;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &::before {
            content: '';
            transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
            background-color: var(--c-surf-4);
            border-top-right-radius: inherit;
            border-bottom-right-radius: inherit;
            position: absolute;
            inset: 0;
            display: block;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
        }
    }

    &:hover #{&}__open::before {
        inset-inline-end: 90%;
    }

    &__modset {
        position: relative;
        select::-ms-expand {
            display: none;
        }
        select {
            -moz-appearance: none;
            -webkit-appearance: none;
            appearance: none;
            border: none;
            font-weight: 500;
            cursor: pointer;
            appearance: none;
            border: none;
            block-size: 2rem;
            inline-size: 100%;
            border-radius: 1rem;
            text-align: center;
            color: var(--c-surf-2);
            background-size: 5px 5px, 5px 5px, 1px 1.5em;
            background-repeat: no-repeat;
            background-color: transparent;
            &:hover {
                background-image: linear-gradient(45deg, transparent 50%, gray 50%),
                    linear-gradient(135deg, gray 50%, transparent 50%);
                background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px),
                    calc(100% - 2.5em) 0.5em;
            }
            option,
            optgroup {
                cursor: pointer;
                background: var(--c-surf-4);
            }
            outline: 0;
        }
        select:focus::-ms-value {
            background-color: transparent;
        }
    }
}
</style>
