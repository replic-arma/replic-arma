<template>
    <li class="repo">
        <img class="repo__img" v-once :src="repository.image" />
        <span class="repo__name" v-once>{{ repository.name }}</span>
        <div class="repo__status">
            <Status :status="status" :progress="progress"></Status>
        </div>
        <div class="repo__modset">
            <select v-model="currentModsetId">
                <option v-once v-for="(modset, i) of repository.modsets" :key="i" :value="modset.id">
                    {{ modset.name }}
                </option>
            </select>
        </div>
        <div class="repo__play" @click="play()">
            <span v-t="'play'"></span>
            <mdicon name="play" size="35" />
        </div>
        <router-link v-once :to="'/repo/' + repository.id + '/modsets'" class="repo__open button">
            <mdicon name="folder-open"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts" setup>
import { useHashStore } from '@/store/hash';
import type { IHashItem } from '@/store/hash';
import { computed, onMounted, ref } from 'vue';
import Status from './util/Status.vue';
import { launchModset } from '@/util/system/game';
const props = defineProps({
    repository: {
        type: Object,
        default: null,
    },
});
const status = computed(() => {
    const cacheData = useHashStore().cache.find((cacheModset) => cacheModset.id === currentModsetId.value);
    if (cacheData === undefined) return 'checking';
    if (cacheData.outdatedFiles.length > 0 || cacheData.missingFiles.length > 0) {
        return 'outdated';
    } else {
        return 'ready';
    }
});

const progress = computed(() => {
    if (useHashStore().current === null || useHashStore().current?.repoId !== props.repository.id) return 0;
    const { checkedFiles, filesToCheck } = useHashStore().current as IHashItem;
    return Math.floor((checkedFiles / filesToCheck) * 100);
});

onMounted(() => {
    if (props.repository.modsets.length === 0) return '';
    currentModsetId.value = props.repository.modsets[0].id ?? '';
});
function play() {
    launchModset(currentModsetId.value);
}
const currentModsetId = ref('');
</script>
<style lang="scss" scoped>
.repo {
    block-size: 5rem;
    inline-size: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 4rem 1fr 0.5fr 1fr 0.5fr 10%;
    padding-inline-start: var(--space-sm);
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;
    &:hover {
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__img {
        block-size: var(--space-xl);
    }

    &__name {
        font-weight: bold;
        font-size: 18pt;
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

    &__play {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 5rem;
        margin-inline-start: 1rem;

        & > span:first-child {
            color: var(--c-surf-2);
        }

        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }
    &__modset {
        position: relative;
        select {
            background: #f2f2f2;
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
            background-image: linear-gradient(45deg, transparent 50%, gray 50%),
                linear-gradient(135deg, gray 50%, transparent 50%), linear-gradient(to right, #ccc, #ccc);
            background-position: calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px),
                calc(100% - 2.5em) 0.5em;
            &:focus {
                background-image: linear-gradient(45deg, gray 50%, transparent 50%),
                    linear-gradient(135deg, transparent 50%, gray 50%), linear-gradient(to right, #ccc, #ccc);
                background-position: calc(100% - 15px) 1em, calc(100% - 20px) 1em, calc(100% - 2.5em) 0.5em;
                background-size: 5px 5px, 5px 5px, 1px 1.5em;
                background-repeat: no-repeat;
                outline: 0;
            }
        }
    }
}
</style>
