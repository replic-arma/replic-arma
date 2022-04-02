<template>
    <replic-dialog :dialogName="'modsetAdd'">
        <template v-slot:header>
            <span v-t="'modset.add'"></span>
            <mdicon role="button" name="close" size="35" />
        </template>
        <template v-slot:main>
            <div class="txt">
                <label for="modsetName" v-t="'modset.name'"></label>
                <div class="txt__input-wrapper">
                    <input class="txt__input" type="text" name="modsetName" />
                </div>
            </div>
            <button class="button" v-t="'submit'"></button>
        </template>
    </replic-dialog>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
import { useRepoStore } from '@/store/repo';

@Options({
    components: {
        ReplicDialog: ReplicDialogVue,
    },
})
export default class ModsetAddVue extends Vue {
    private repoStore = useRepoStore();
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &:deep(&__heading) {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &:deep(&__content) {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
