<template>
    <div class="general-settings">
        <replic-path-selector :pathSelector="{label: $t('a3exe'), name:'a3exe' }"></replic-path-selector>
        <replic-path-selector :pathSelector="{label: $t('mod_directory'), name:'modDirectory' }"></replic-path-selector>
        <div class="general-settings__speed">
            <label for="speed">{{$t('download_max_speed')}}<mdicon name="information" size="20" /></label>
            <select class="select" name="speed">
                <option>unlimited</option>
                <option>1 MB/s</option>
                <option>2 MB/s</option>
                <option>5 MB/s</option>
                <option>10 MB/s</option>
                <option>25 MB/s</option>
            </select>
        </div>
        <div class="general-settings__language">
            <label for="language">{{$t('language')}}<mdicon name="information" size="20" /></label>
            <select class="select" name="language">
                <option>English</option>
                <option>German</option>
            </select>
        </div>
        <div class="general-settings__buttons">
            <button class="button button--outline button--danger" type="button">{{$t('cache_clear')}}</button>
            <button class="button button--outline button--danger" type="button">{{$t('settings.reset')}}</button>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import ReplicPathSelectorVue from '../util/ReplicPathsSelector.vue';
@Options({
    components: {
        ReplicPathSelector: ReplicPathSelectorVue
    }
})
export default class GeneralVue extends Vue {

}
</script>
<style lang="scss" scoped>
.general-settings {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    grid-template-columns: 1fr;
    &__speed {
        display: flex;
        flex-direction: column;
    }
    &__language {
        display: flex;
        flex-direction: column;
    }
    &__buttons {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

}
</style>
