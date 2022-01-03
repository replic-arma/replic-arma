<template>
    <transition name="fade" mode="out-in">
        <div class="replic-dialog" v-show="shown">
            <div class="replic-dialog__heading">
                <slot name="header" />
            </div>
            <div class="replic-dialog__content">
                <slot name="main" />
            </div>
        </div>
    </transition>
</template>
<script lang="ts">
import { useDialogStore } from '@/store/dialog';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: { }
})
export default class ReplicDialogVue extends Vue {
    @Prop({ type: String }) private dialogName!: string;
    public dialogStore = useDialogStore();
    private storeSubscription: (() => void)|undefined;
    private shown = false;
    public mounted (): void {
        this.dialogStore.addDialog(this.dialogName);
        this.storeSubscription = this.dialogStore.$subscribe(() => {
            this.shown = this.dialogStore.getDialog(this.dialogName)?.state ?? false;
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
