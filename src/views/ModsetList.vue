<template>
    <ul class="modsets">
       <modset></modset>
    </ul>
</template>

<script lang="ts">
import ModsetVue from '@/components/Modset.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Modset: ModsetVue
    }
})
export default class ModsetListVue extends Vue {

}
</script>

<style lang="scss" scoped>
.modsets {
  padding: 0;
}
</style>
