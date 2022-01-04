<template>
  <div class="settings">
    <div class="settings__heading">
      <router-link class="button" to="/"><mdicon name="chevron-left" size="55"/></router-link>
      <h1>{{$t('settings.title')}}</h1>
      <button class="button settings__save button--center">{{$t('save')}}</button>
    </div>
    <tabs :tabItems="subnaviItems"></tabs>
    <router-view />
  </div>
</template>

<script lang="ts">
import TabsVue, { TabsItem } from '@/components/util/Tabs.vue';
import { Options, Vue } from 'vue-class-component';
import GeneralVue from '@/components/settings/General.vue';
import LaunchVue from '@/components/settings/Launch.vue';
import AboutVue from '@/components/settings/About.vue';
@Options({
    components: {
        Tabs: TabsVue
    }
})
export default class SettingsView extends Vue {
  private subnaviItems: TabsItem[] = [
      { label: 'General', component: GeneralVue },
      { label: 'Launch Options', component: LaunchVue },
      { label: 'About', component: AboutVue }
  ];
}
</script>

<style lang="scss">
.settings {

  &__heading {
    display: grid;
    grid-template-columns: 4rem 1fr auto;
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
  &__save {
    font-size: 18pt;
  }
}
</style>
