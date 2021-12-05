<template>
    <replic-dialog ref="test">
        <template v-slot:header>
            <span>Settings</span>
            <mdicon role="button" @click="dialogStore.toggleDialog" name="close" size="35" />
        </template>
        <div class="settings">
            <tabs :tabItems="subnaviItems"></tabs>
        </div>
    </replic-dialog>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
import TabsVue, { TabsItem } from './util/Tabs.vue';
import GeneralVue from './settings/General.vue';
import LaunchVue from './settings/Launch.vue';
import { useDialogStore } from '@/store/dialog';

@Options({
    components: {
        ReplicDialog: ReplicDialogVue,
        Tabs: TabsVue
    }
})
export default class RepoSettingsVue extends Vue {
    private subnaviItems: TabsItem[] = [
        { label: 'General', component: GeneralVue },
        { label: 'launch', component: LaunchVue }
    ];

    private dialogStore = useDialogStore();
    private toggleDialog = () => { this.dialogStore.toggleDialog(); };
}
</script>
<style lang="scss" scoped>
.settings {

}
.replic-dialog {
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto;
        font-size: 20pt;
        font-weight: bold;
    }
}
</style>
