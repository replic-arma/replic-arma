<template>
    <li class="server">
        <div class="server__info">
            <span class="server__host">{{server.host}}</span>
            <small class="server__name">{{server.name}}</small>
        </div>
        <span class="server__port">{{server.port}}</span>
        <span class="server__password"><mdicon name="lock-outline" />{{server.password === undefined || server.password === "" ? '-' : server.password}}</span>
        <span class="server__modset">{{server.modset !== undefined ? server.modset : '-'}}</span>
        <div class="server__play" @click="launchGame()">
            <span>Play</span>
            <mdicon name="play" size="35"/>
        </div>
    </li>
</template>
<script lang="ts">
import { GameServer } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { System } from '@/util/system';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: { }
})
export default class ServerVue extends Vue {
    @Prop({ type: Object }) private server!: GameServer;
    private async launchGame () {
        const repoStore = useRepoStore();
        if (this.server.modset === undefined) throw new Error('Server Modset undefined');
        if (repoStore.currentRepoId === null) throw new Error('Current repo null');
        await System.launchGame(repoStore.currentRepoId, this.server.modset, this.server);
    }
}
</script>
<style lang="scss" scoped>
.server {
    block-size: 5rem;
    padding-inline: 1rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 2fr .5fr 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;
    &:hover {
        box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    }

    &__host {
        font-weight: bold;
        font-size: 18pt;
    }

    &__name {
        color: var(--c-text-3);
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

    &__port {
        font-size: 18pt;
        color: var(--c-text-3);
    }

    &__password {
        font-size: 18pt;
    }

    &__info {
        display: grid;
    }
}
</style>
