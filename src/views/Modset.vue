<template>
  <div class="modset">
    <div class="modset__heading">
      <mdicon name="chevron-left" size="45" @click="$router.back()"/>
      <h1>{{modset.name}}</h1>
      <div class="icon-group">
        <button class="icon-group__play">Play</button>
        <router-link to="/settings/general"><mdicon name="download" size="35"/></router-link>
        <mdicon @click="toggleDialog" name="cog" size="35"/>
      </div>
    </div>
    <ul class="modset__mods">
      <li class="modset__mod" v-for="(mod, i) of modset.mods" :key="i">{{mod.name}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Modset } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: { }
})
export default class ModsetVue extends Vue {
    private modset!: Modset|undefined;
    private modsetIndex!: string;
    private repoStore = useRepoStore();
    public created (): void {
        const repositoryIndex = this.$router.currentRoute.value.params.id as string;
        this.modsetIndex = this.$router.currentRoute.value.params.mid as string;
        const repository = this.repoStore.getRepo(repositoryIndex);
        if (repository === undefined || repository?.modsets === undefined) return;
        this.modset = repository?.modsets.find(modset => modset.id === this.modsetIndex);
    }
}
</script>

<style lang="scss" scoped>
.modset {

  &__heading {
    display: grid;
    grid-template-columns: 3rem 1fr auto auto;
    font-size: 22pt;
    align-items: center;
    justify-content: center;
    h1 {
      margin: 0;
      font-weight: bold;
      color: #333333
    }
    .icon-group {
      display: grid;
      grid-template-columns: 10rem repeat(2, 3rem);
      align-items: center;
      justify-content: center;
      &__play {
        background: var(--c-surf-2);
        border-radius: 1rem;
        color: white;
        text-align: center;
        block-size: var(--space-xl);
        margin-inline-end: var(--space-md);
        font-size: 18pt;
        cursor: pointer;
      }
    }
  }

  &__mods {
    display: flex;
    flex-flow: row wrap;
    list-style-type: none;
  }

  &__mod {
    background: var(--c-surf-3);
    width: fit-content;
    border-radius: 999px;
    padding-inline: var(--space-md);
    padding-block: var(--space-xs);
    margin-inline: var(--space-xs);
    margin-block: var(--space-xxs);
  }
}
</style>
