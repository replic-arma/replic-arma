<template>
    <li class="modset">
       <span class="modset__name">Gruppe Adler</span>
        <span class="repo__status">asd</span>
        <div class="modset__play">
            <span>Play</span>
            <mdicon name="play" size="35"/>
        </div>
        <router-link to="/repo" class="modset__open">
            <mdicon name="folder-open"></mdicon>
        </router-link>
    </li>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: { }
})
export default class ServerVue extends Vue {}
</script>
<style lang="scss" scoped>
.modset {
    height: 5rem;
    width: 100%;
    list-style-type: none;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 10%;
    align-items: center;
    justify-content:center;
    background: var(--c-surf-4);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    overflow: hidden;

    &__name {
        font-weight: bold;
        font-size: 24pt;
        padding: 1rem;
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
}
</style>
