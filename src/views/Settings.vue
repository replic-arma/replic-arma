<template>
    <div class="settings">
        <div class="settings__heading">
            <router-link class="button" to="/"><mdicon name="chevron-left" size="55" /></router-link>
            <h1 v-t="'settings.title'"></h1>
            <button class="button settings__save button--center" @click="saveSettings()" v-t="'save'"></button>
        </div>
        <General></General>
        <router-view />
    </div>
</template>

<script lang="ts" setup>
import LaunchVue from '@/components/settings/Launch.vue';
import AboutVue from '@/components/settings/About.vue';
import { shallowRef } from 'vue';
import { useSettingsStore } from '@/store/settings';

function saveSettings() {
    useSettingsStore().save();
}
</script>

<style lang="scss">
.settings {
    &__heading {
        display: grid;
        grid-template-columns: 4rem 1fr auto;
        font-size: 22pt;
        align-items: center;
        justify-content: center;
        h1 {
            margin: 0;
            font-style: normal;
            font-weight: bold;
            color: #333333;
        }
    }
    &__save {
        font-size: 18pt;
    }
}
</style>
