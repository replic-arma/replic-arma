<template>
    <replic-dialog :dialogName="'repoSettings'">
        <template v-slot:header>
            <span>Settings</span>
            <mdicon role="button" @click="dialogStore.toggleDialog('repoSettings')" name="close" size="35" />
        </template>
        <template v-slot:main>
            <tabs :tabItems="subnaviItems"></tabs>
        </template>
    </replic-dialog>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
import TabsVue, { TabsItem } from './util/Tabs.vue';
import LaunchVue from './settings/Launch.vue';
import { useDialogStore } from '@/store/dialog';
import RepoSettingsFormVue from './settings/RepoSettings.vue';

@Options({
    components: {
        ReplicDialog: ReplicDialogVue,
        Tabs: TabsVue
    }
})
export default class RepoSettingsVue extends Vue {
    private subnaviItems: TabsItem[] = [
        { label: 'General', component: RepoSettingsFormVue },
        { label: 'Launch Options', component: LaunchVue }
    ];

    private dialogStore = useDialogStore();
    private toggleDialog = () => { this.dialogStore.toggleDialog('repoSettings'); };
}
</script>
<style lang="scss" scoped>
.settings {

}
.replic-dialog {
  height: fit-content;
  width: 75%;
  &::v-deep &__heading {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    font-size: 20pt;
    span:not(:first-child) {
        cursor: pointer;
    }
  }
}
</style>
