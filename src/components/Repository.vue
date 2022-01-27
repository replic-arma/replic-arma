<template>
    <li class="repo">
        <img class="repo__img" :src="repository.image">
        <span class="repo__name">{{repository.name}}</span>
        <span class="repo__status" :class="`status--${status}`">{{$t('download-status.' + status)}}</span>
        <div class="repo__modset">
            <select>
                <option v-for="(modset, i) of modsets" :key="i">{{modset.name}}</option>
            </select>
        </div>
        <div class="repo__play">
            <span>Play</span>
            <mdicon name="play" size="35"/>
        </div>
        <router-link :to="'/repo/'+ repository.id + '/modsets'" class="repo__open button">
            <mdicon name="folder-open"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts">
import { ReplicArmaRepository } from '@/models/Repository';
import { useDownloadStore } from '@/store/download';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Options({
    components: { }
})
export default class RepoVue extends Vue {
    @Prop({ type: Object }) private repository!: ReplicArmaRepository;
    private downloadStore = useDownloadStore();
    private get status () {
        if (this.downloadStore.getUpdateNeeded.find(downloadItem => downloadItem.item.id === this.repository?.id)) {
            return 'outdated';
        } else if (this.downloadStore.getDownloads.find(downloadItem => downloadItem.item.id === this.repository?.id)) {
            return 'downloading';
        } else if (this.downloadStore.getQueue.find(downloadItem => downloadItem.item.id === this.repository?.id)) {
            return 'queued';
        }
        return 'finished';
    }

    private get modsets () {
        return this.repository?.modsets ? Array.from(this.repository?.modsets?.values()) : [];
    }
}
</script>
<style lang="scss" scoped>
.repo {
    block-size: 5rem;
    inline-size: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 4rem 1fr 1fr 1fr 1fr 10%;
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
        font-size: 15pt;
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
        margin-inline-start: 1rem;
        & > span:first-child {
            color: var(--c-surf-2);
        }
        &:hover {
            transition: all .1s ease-in;
            background-color: var(--c-surf-3);
        }
    }
    &__modset {
        position: relative;
        select {
            cursor: pointer;
            appearance: none;
            border: none;
            block-size: 2rem;
            inline-size: 100%;
            border-radius: 1rem;
            text-align: center;
            color: var(--c-surf-2);
            background-size:
                5px 5px,
                5px 5px,
                1px 1.5em;
            background-repeat: no-repeat;
            background-image:
                linear-gradient(45deg, transparent 50%, gray 50%),
                linear-gradient(135deg, gray 50%, transparent 50%),
                linear-gradient(to right, #ccc, #ccc);
            background-position:
                calc(100% - 20px) calc(1em + 2px),
                calc(100% - 15px) calc(1em + 2px),
                calc(100% - 2.5em) 0.5em;
            &:focus {
                background-image:
                    linear-gradient(45deg, gray 50%, transparent 50%),
                    linear-gradient(135deg, transparent 50%, gray 50%),
                    linear-gradient(to right, #ccc, #ccc);
                background-position:
                    calc(100% - 15px) 1em,
                    calc(100% - 20px) 1em,
                    calc(100% - 2.5em) 0.5em;
                background-size:
                    5px 5px,
                    5px 5px,
                    1px 1.5em;
                background-repeat: no-repeat;
                outline: 0;
            }
        }
    }
}
</style>
