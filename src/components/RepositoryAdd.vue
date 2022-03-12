<template>
    <mdicon
        name="plus"
        class="add-button"
        role="button"
        @click="isOpen = true"
    ></mdicon>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span>{{ $t('repository.add') }}</span>
                <mdicon
                    role="button"
                    @click="isOpen = false"
                    name="close"
                    size="35"
                />
            </div>
            <div class="replic-dialog__content">
                <div class="txt">
                    <label for="repoName">{{
                        $t('repository.autoconfig')
                    }}</label>
                    <div class="txt__input-wrapper">
                        <input
                            class="txt__input"
                            type="text"
                            name="repoName"
                            v-model="autoConfigModel"
                        />
                    </div>
                </div>
                <div class="txt">
                    <label for="repoName">{{ $t('repository.name') }}</label>
                    <div class="txt__input-wrapper">
                        <input class="txt__input" type="text" name="repoName" />
                    </div>
                </div>
                <button class="button" @click="addRepo">
                    {{ $t('submit') }}
                </button>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ReplicDialogVue from './util/ReplicDialog.vue';
import { useRepoStore } from '@/store/repo';
import Toast from './util/Toast';
@Options({
    components: {
        ReplicDialog: ReplicDialogVue
    }
})
export default class RepositoryAddVue extends Vue {
    private autoConfigModel = '';
    private isOpen = false;
    private addRepo () {
        const repoStore = useRepoStore();
        repoStore.addRepo(this.autoConfigModel).then(() => {
            this.isOpen = false;
            Toast('Added Repository');
        });
    }
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &__content {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
