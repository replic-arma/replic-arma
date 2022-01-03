<template>
  <div class="repo-settings">
    <div class="repo-settings__heading">
      <router-link :to="'/repo/'+ repositoryIndex + '/modsets'"><mdicon name="chevron-left" size="55"/></router-link>
      <h1>Settings</h1>
    </div>
      <tabs :tabItems="subnaviItems"></tabs>
  </div>
</template>

<script lang="ts">
import GeneralRepoVue from '@/components/settings/GeneralRepo.vue';
import LaunchVue from '@/components/settings/Launch.vue';
import TabsVue, { TabsItem } from '@/components/util/Tabs.vue';
import { ReplicArmaRepository } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: { Tabs: TabsVue }
})
export default class RepoSettingsView extends Vue {
  private repository!: ReplicArmaRepository|undefined;
  private repositoryIndex!: string;
  private repoStore = useRepoStore();
  private subnaviItems: TabsItem[] = [
      { label: 'General', component: GeneralRepoVue },
      { label: 'Launch Options', component: LaunchVue }
  ];

  public created ():void {
      this.repositoryIndex = this.$router.currentRoute.value.params.id as string;

      this.repository = this.repoStore.getRepo(this.repositoryIndex);
  }
}
</script>

<style lang="scss">
.repo-settings{
  position: relative;
  &__heading {
    display: grid;
    grid-template-columns: 4rem max-content 4rem 1fr;
    font-size: 22pt;
    align-items: center;
    justify-content: center;

    h1 {
      margin: 0;
      font-weight: bold;
      color: #333333
    }
  }
}
</style>
