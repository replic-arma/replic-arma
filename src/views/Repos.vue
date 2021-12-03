<template>
  <div class="repos">
    <div class="repos__heading">
      <h1>Repos</h1>
      <div class="icon-group">
        <router-link to="/settings"><mdicon name="download" size="35"/></router-link>
        <mdicon name="refresh" size="35"/>
        <router-link to="/settings/general"><mdicon name="cog" size="35"/></router-link>
      </div>
    </div>
    <ul>
      <repo></repo>
      <repo></repo>
      <repo></repo>
      <repo></repo>
      <repo></repo>
      <repo></repo>
      <repo></repo>
      <repo></repo>
    </ul>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import RepoVue from '@/components/Repo.vue';
@Options({
    components: {
        Repo: RepoVue
    }
})
export default class ReposView extends Vue {}
</script>

<style lang="scss">
.repos {
  ul {
    padding: 0;
  }

  li {
    margin-bottom: 1rem;
  }

  &__heading {
    display: grid;
    grid-template-columns: 1fr auto auto;

    h1 {
      margin: 0;
      font-style: normal;
      font-weight: bold;
      color: #333333
    }
    .icon-group {
      display: grid;
      grid-template-columns: repeat(3, 3rem);
    }
  }
}
</style>
