<template>
    <li class="collection">
        <div class="collection__info">
            <span class="collection__name">{{ collection.name }}</span>
            <small class="collection__description">{{ collection.description }}</small>
        </div>
        <span class="repo__status" :class="`status--${status}`" v-t="'download-status.' + status"></span>
        <div class="collection__play">
            <span>Play</span>
            <mdicon name="play" size="35" />
        </div>
        <router-link :to="'./collection/' + collection.id" class="collection__open button">
            <mdicon name="folder-open"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts">
import type { Collection } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class CollectionItemVue extends Vue {
    @Prop({ type: Object }) private collection!: Collection;
    private downloadStore = useDownloadStore();
    private repoStore = useRepoStore();
    private get status() {
        return 'finished';
    }
}
</script>
<style lang="scss" scoped>
.collection {
    height: 5rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 10%;
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;

    &:hover {
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__name {
        font-weight: bold;
        font-size: 18pt;
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
        & > span:first-child {
            color: var(--c-surf-2);
        }
        &:hover {
            transition: all 0.1s ease-in;
            background-color: var(--c-surf-3);
        }
    }

    &__collection {
        list-style-type: none;
        color: var(--c-surf-2);
    }

    &__info {
        display: grid;
        padding-inline-start: var(--space-sm);
    }

    &__description {
        color: var(--c-text-3);
    }
}
</style>
