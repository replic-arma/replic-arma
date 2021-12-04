<template>
    <ul class="modsets">
       <modset v-for="(modset, i) of modsets" :key="i" :modset="modset"></modset>
    </ul>
</template>

<script lang="ts">
import ModsetVue from '@/components/Modset.vue';
import { Modset } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Modset: ModsetVue
    }
})
export default class ModsetListVue extends Vue {
    private modsets!: Modset[];
    private repositoryIndex!: number;
    private repoStore = useRepoStore();
    public created (): void {
        this.repositoryIndex = +this.$router.currentRoute.value.params.id;
        this.modsets = this.repoStore.getRepo(this.repositoryIndex)?.modsets ?? [];
    }
}
</script>

<style lang="scss" scoped>
.modsets {
  padding: 0;
  li {
    margin-bottom: 1rem;
  }
}
</style>
