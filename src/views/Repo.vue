<template>
  <div class="repo">
    <div class="repo__heading">
      <router-link to="/"><mdicon name="chevron-left" size="35"/></router-link>
      <h1>Settings</h1>
    </div>
    <subnavi :subnaviItems="subnaviItems"></subnavi>
    <router-view />
  </div>
</template>

<script lang="ts">
import SubnaviVue, { SubnaviItem } from '@/components/Subnavi.vue';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {
        Subnavi: SubnaviVue
    }
})
export default class RepoView extends Vue {
  private subnaviItems: SubnaviItem[] = [
      { label: 'Modset', link: '/repo/modset' },
      { label: 'Server', link: '/repo/modset' }
  ];
}
</script>

<style lang="scss">
.repo {

  &__heading {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    h1 {
      margin: 0;
      font-style: normal;
      font-weight: bold;
      color: #333333
    }
  }
}
</style>
