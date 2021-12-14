<template>
    <div class="replic-path-selector">
        <label :for="pathSelector.name">{{pathSelector.label}}<mdicon name="information" size="20" /></label>
        <div class="replic-path-selector__input-wrapper">
            <input type="text" :name="pathSelector.name" class="replic-path-selector__input" />
            <div class="replic-path-selector__button" @click="openDialog">
                <mdicon name="folder"></mdicon>
                <span>{{$t('select')}}</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { open } from '@tauri-apps/api/dialog';
export interface PathSelectorModel {
    label: string;
    name: string;
}
@Options({
    components: { }
})
export default class ReplicPathSelectorVue extends Vue {
    @Prop({ type: Object }) private pathSelector!: PathSelectorModel;
    public openDialog () {
        open().then((filepath) => {
            console.log('Selected path: ', filepath);
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
            block-size: 2.5rem;
            padding-inline: 1rem;
            position: relative;
            background: #fff;
            border-radius: .5rem;
        }
        &__input {
            inline-size: 100%;
            block-size: 100%;
            outline: 0;
            border: none;
            background: none;
        }
        &__button {
            display: grid;
            grid-template-columns: 2rem 4rem;
            position: absolute;
            right: 0;
            top: 0;
            block-size: 100%;
            padding-inline-start: var(--space-xs);
            align-content: center;
            background: lightgrey;
            cursor: pointer;
            border-top-right-radius: .5rem;
            border-bottom-right-radius: .5rem;
            &:hover {
                background: var(--c-surf-3);
            }
        }
}
</style>
