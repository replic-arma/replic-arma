<template>
    <li class="modset">
        <div class="modset__info">
            <span class="modset__name">{{modset.name}}</span>
            <small class="modset__description">{{modset.description}}</small>
        </div>
        <span class="repo__status" :class="`status--${status}`">
            <template v-if="status === 'checking' || status === 'updating'">
                <mdicon name="loading" spin />
            </template>
            {{$t('download-status.' + status)}}
            <template v-if="status === 'checking' || status === 'updating' && progress !== 0">
                <span>...{{progress}}%</span>
            </template>
        </span>
        <div class="button modset__play">
            <span>Play</span>
            <mdicon name="play" size="35"/>
        </div>
        <router-link :to="'./modset/' + modset.id" class="modset__open button">
            <mdicon name="folder-open"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts">
import { Modset } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: { }
})
export default class ModsetVue extends Vue {
    @Prop({ type: Object }) private modset!: Modset;
    private downloadStore = useDownloadStore();
    private repoStore = useRepoStore();
    private hashStore = useHashStore();
    private get status () {
        return this.repoStore.getModset(this.repoStore.currentRepoId, this.modset.id)?.status ?? 'checking';
    }

    private get progress () {
        const hashStore = useHashStore();
        if (hashStore.current === null || hashStore.current.repoId !== this.repoStore.currentRepoId) return 0;
        return Math.floor(hashStore.current.checkedFiles / hashStore.current.filesToCheck * 100);
    }
}
</script>
<style lang="scss" scoped>
.modset {
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
            transition: all .1s cubic-bezier(0.4, 0.0, 0.2, 1);
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
        justify-content:center;
        cursor: pointer;
        border-radius: 5rem;
        & > span:first-child {
            color: var(--c-surf-2);
        }
        &:hover {
            transition: all .1s ease-in;
            background-color: var(--c-surf-3);
        }
    }

    &__modset {
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
