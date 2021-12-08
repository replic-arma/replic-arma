<template>
    <li class="server">
        <div class="server__info">
            <span class="server__host">{{server.host}}</span>
            <small class="server__name">{{server.name}}</small>
        </div>
        <span class="server__port">{{server.port}}</span>
        <span class="server__password"><mdicon name="lock-outline" />{{server.password !== undefine ? server.password : '-'}}</span>
        <span class="server__modset">{{server.modset !== undefine ? server.modset : '-'}}</span>
        <!-- <div class="modset__play">
            <span>Play</span>
            <mdicon name="play" size="35"/>
        </div> -->
    </li>
</template>
<script lang="ts">
import { GameServer } from '@/models/Repository';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: { }
})
export default class ServerVue extends Vue {
    @Prop({ type: Object }) private server!: GameServer;
}
</script>
<style lang="scss" scoped>
.server {
    height: 5rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
    background: var(--c-surf-4);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;

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
        padding-inline-start: var(--space-sm);
    }
}
</style>
