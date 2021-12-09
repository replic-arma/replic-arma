<template>
    <div class="about">
        <div>
            <span class="about__headline">Version</span>
            <span>1.0</span>
        </div>
        <div>
            <span class="about__headline">Code + Concept</span>
            <span>DerZade</span>
            <span>RednecksRevenge</span>
            <span>Willard</span>
        </div>
        <div>
            <span class="about__headline">Design + Concept</span>
            <span>nomisum</span>
        </div>
        <a href="https://github.com/replic-arma" target="__blank">Github<mdicon name="github" size="50" /></a>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: { }
})
export default class AboutVue extends Vue {
}
</script>
<style lang="scss" scoped>
.about {
    display: grid;
    row-gap: 3rem;
    margin-block-start: 2rem;
    & > div {
        display: grid;
    }
    &__headline {
        color: var(--c-text-3);
        padding-inline: .5rem;
        margin-block-end: .5rem;
    }
}
</style>
