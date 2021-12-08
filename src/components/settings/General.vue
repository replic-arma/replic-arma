<template>
    <form>
        <label for="a3exe">ARMA 3 EXE</label>
        <input type="text" name="a3exe" />
        <button @click="openDialog">asdasd</button>
        <label for="a3exe">MOD DIRECTORY</label>
        <input type="text" name="a3exe" />
        <button @click="openDialog">asdasd</button>
    </form>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { open } from '@tauri-apps/api/dialog';
@Options({
    components: { }
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

</style>
