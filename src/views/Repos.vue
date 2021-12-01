<template>
  <div class="repos">
    <div class="repos__heading">
      <h1>Repos</h1>
      <div class="icon-group">
        <router-link to="/settings"><mdicon name="download" size="35"/></router-link>
        <mdicon name="refresh" size="35"/>
        <router-link to="/settings"><mdicon name="cog" size="35"/></router-link>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {}
})
export default class ReposView extends Vue {}
</script>

<style lang="scss">
.repos {

  &__heading {
    display: grid;
    grid-template-columns: 1fr auto auto;
    padding: 0 2rem 0 2rem;
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
