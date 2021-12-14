<template>
    <div class="general-repo-settings">
        <div class="txt">
            <label for="repoName">{{$t('repository.name')}}</label>
            <div class="txt__input-wrapper">
                <input class="txt__input" type="text" name="repoName" />
            </div>
        </div>
        <div class="txt">
            <label for="repoName">{{$t('repository.autoconfig')}}</label>
            <div class="txt__input-wrapper">
                <input class="txt__input" type="text" name="repoName" />
            </div>
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
export default class GeneralRepoVue extends Vue {

}
</script>
<style lang="scss" scoped>
.general-repo-settings {
    display: grid;
    row-gap: 1.5rem;
    grid-template-columns: 1fr;
}
</style>
