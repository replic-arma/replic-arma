<template>
    <form class="form-general">
        <replic-path-selector :pathSelector="{label: 'Arma 3 Exe', name:'a3exe' }"></replic-path-selector>
        <replic-path-selector :pathSelector="{label: 'Mod Directory', name:'modDirectory' }"></replic-path-selector>
        <div class="form-general__speed">
            <label for="speed">Max Download Speed</label>
            <select>
                <option>1 MB/s</option>
                <option>2 MB/s</option>
                <option>5 MB/s</option>
                <option>10 MB/s</option>
                <option>25 MB/s</option>
            </select>
        </div>
        <div class="form-general__speed">
            <label for="speed">language</label>
            <select>
                <option>EN</option>
                <option>GER</option>
            </select>
        </div>
    </form>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { open } from '@tauri-apps/api/dialog';
import ReplicPathSelectorVue from '../util/ReplicPathsSelector.vue';
@Options({
    components: {
        ReplicPathSelector: ReplicPathSelectorVue
    }
})
export default class GeneralVue extends Vue {
    public openDialog () {
        open().then((filepath) => {
            console.log('Selected path: ', filepath);
        });
    }
}
</script>
<style lang="scss" scoped>
.form-general {
    display: grid;
    row-gap: 2rem;
    grid-template-columns: 1fr;
    &__speed {
        display: grid;
    }

}
@media only screen and (min-width: 600px) {
    .form-general {
        display: grid;
        row-gap: 2rem;
        grid-template-columns: 1fr /2;

    }
}
</style>
