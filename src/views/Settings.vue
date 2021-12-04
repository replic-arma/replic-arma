<template>
  <div class="settings">
    <div class="settings__heading">
      <router-link to="/"><mdicon name="chevron-left" size="35"/></router-link>
      <h1>{{$t('settings')}}</h1>
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
export default class SettingsView extends Vue {
  private subnaviItems: SubnaviItem[] = [
      { label: 'General', link: '/settings/general' },
      { label: 'Launch Options', link: '/settings/launch' },
      { label: 'About', link: '/settings/about' }
  ];
}
</script>

<style lang="scss">
.settings {

  &__heading {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    font-size: 22pt;
    align-items: center;
    justify-content: center;
    h1 {
      margin: 0;
      font-style: normal;
      font-weight: bold;
      color: #333333
    }
  }
}
</style>
