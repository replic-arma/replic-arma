<template>
    <div class="replic-checkbox" v-if="mod !== undefined">
        <label class="replic-checkbox__thumb" :for="'check-' + mod.name" @click="update()">
            <mdicon name="check" />
        </label>
        <label class="replic-checkbox__label" :for="'check-' + mod.name" @click="update()"
            ><span>{{ mod.name }}</span></label
        >
    </div>
</template>
<script lang="ts" setup>
import type { Collection, Mod } from '@/models/Repository';
import { ref } from 'vue';
interface Props {
    mod: Mod;
    collection: Collection;
}
const props = defineProps<Props>();
const collection = ref(props.collection);

async function update() {
    collection.value.localMods = collection.value.localMods?.filter((mod: Mod) => mod.path !== props.mod.path);
}
</script>

<style lang="scss">
.replic-checkbox {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 100%;
    &__check {
        display: none;
    }

    &__check:checked ~ div {
        display: block;
    }

    &__label {
        cursor: pointer;
    }
    &__thumb {
        content: '';
        block-size: 2rem;
        inline-size: 2rem;
        border-radius: 2rem;
        background: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-inline-end: 1rem;
        cursor: pointer;
    }
    &:hover &__folder {
        visibility: visible;
    }
    &__folder {
        visibility: hidden;
        margin-left: auto;
        padding-inline: 0.5rem;
        padding-block: 0.5rem;
        border-radius: 2rem;
        cursor: pointer;
        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }
}
</style>
