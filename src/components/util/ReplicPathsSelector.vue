<template>
    <div class="replic-path-selector">
        <label :for="pathSelector.name">{{ pathSelector.label }}</label>
        <div class="replic-path-selector__input-wrapper">
            <input type="text" :id="pathSelector.name" class="replic-path-selector__input" v-model="model" />
            <button class="replic-path-selector__button" @click="openDialog">
                <span>{{ $t('select') }}</span>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { open, type OpenDialogOptions } from '@tauri-apps/api/dialog';
import { useSettingsStore } from '@/store/settings';
export interface PathSelectorModel {
    label: string;
    name: string;
}
@Options({
    emits: ['update:modelValue'],
    components: {},
})
export default class ReplicPathSelectorVue extends Vue {
    @Prop({ type: Object }) private pathSelector!: PathSelectorModel;
    @Prop({ type: Object }) private pathSelectorOptions: OpenDialogOptions = {};

    @Prop({ type: [String], required: true }) private modelValue!: string | null;

    private get model() {
        return this.modelValue;
    }

    private set model(val) {
        this.$emit('update:modelValue', val);
    }

    private settingsStore = useSettingsStore();
    public openDialog(): void {
        open(this.pathSelectorOptions).then((filepath) => {
            if (filepath === null) return;
            this.model = filepath as string;
        });
    }
}
</script>

<style lang="scss" scoped>
.replic-path-selector {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 3rem;
    &__input-wrapper {
        position: relative;
        background: #fff;
        border-radius: 0.5rem;
        display: grid;
        grid-template-columns: 1fr auto;
    }
    &__input {
        padding-inline: 1rem;
        inline-size: 100%;
        block-size: 100%;
        outline: 0;
        border: none;
        background: none;
    }
    &__button {
        block-size: 100%;
        inline-size: 5rem;
        padding-inline-start: var(--space-xs);
        align-content: center;
        justify-content: center;
        background: lightgrey;
        cursor: pointer;
        border-top-right-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        &:hover {
            background: var(--c-surf-3);
        }
    }
}
</style>
