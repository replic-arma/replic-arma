<template>
    <div class="replic-dialog" v-show="shown">
        <div class="replic-dialog__heading">
            <slot name="header" />
        </div>
        <div >
            <slot name="main" />
        </div>
    </div>
</template>
<script lang="ts">
import { useDialogStore } from '@/store/dialog';
import { Options, Vue } from 'vue-class-component';

@Options({
    components: { }
})
export default class ReplicDialogVue extends Vue {
    public dialogStore = useDialogStore();
    private storeSubscription: (() => void)|undefined;
    private shown = false;
    public mounted (): void {
        this.storeSubscription = this.dialogStore.$subscribe(() => {
            this.shown = !this.shown;
        });
    }

    public unmounted (): void {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.storeSubscription = () => { };
    }
}
</script>

<style lang="scss">
.replic-dialog {
    height: 500px;
    width: 100%;
    padding: 2rem 3rem;
    position: fixed;
    left: 0;
    right: 0;
    top: 10rem;
    margin-left: auto;
    margin-right: auto;
    box-sizing: border-box;
    &::after {
        content: '';
        display: block;
        background: var(--c-surf-1);
        z-index: -1;
        position: absolute;
        top: 0; left: 0; right: 0;   bottom: 0;
        border-radius: 2px;
    }
    &::before {
        content: '';
        display: block;
        background-color: rgba(0,0,0,0.6);
        z-index: -2;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
    }
    &__heading {}
}
</style>
