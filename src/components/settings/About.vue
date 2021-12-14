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
        <span @click="openGithub">Github<mdicon name="github" size="50" /></span>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { open } from '@tauri-apps/api/shell';
@Options({
    components: { }
})
export default class AboutVue extends Vue {
    private async openGithub () {
        await open('https://github.com/replic-arma');
    }
}
</script>
<style lang="scss" scoped>
.about {
    display: grid;
    row-gap: 3rem;
    & > div {
        display: grid;
    }
    &__headline {
        color: var(--c-text-3);
        margin-block-end: .5rem;
    }
}
</style>
