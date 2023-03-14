<template>
    <div class="about">
        <div class="about-sub">
            <span class="about-sub__headline">Version </span>
            <span>{{ version }} </span>
        </div>
        <div class="about-sub">
            <span class="about-sub__headline"> Code + Concept </span>
            <span>RednecksRevenge</span>
            <span>Willard</span>
            <span>DerZade</span>
        </div>
        <div class="about-sub">
            <span class="about-sub__headline">Design + Concept</span>
            <span>Nomisum</span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { getAppVersion } from '@/util/system/meta';
import { ref } from 'vue';
const version = ref('0.1.0');
getAppVersion().then(v => (version.value = v));
</script>

<style lang="scss" scoped>
.about {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-block-start: 2rem;
    &-sub {
        display: flex;
        flex-direction: column;
        &__headline {
            text-transform: uppercase;
            margin-block-end: 0.5rem;
        }
    }
}
</style>
