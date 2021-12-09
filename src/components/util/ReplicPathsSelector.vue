<template>
    <div class="replic-path-selector">
        <label :for="pathSelector.name" style="grid-area: label">{{pathSelector.label}}</label>
        <input type="text" :name="pathSelector.name" class="replic-path-selector__input" />
        <div class="replic-path-selector__button" @click="openDialog">
            <mdicon name="folder"></mdicon>
            <span>Select</span>
        </div>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
export interface PathSelectorModel {
    label: string;
    name: string;
}
@Options({
    components: { }
})
export default class ReplicPathSelectorVue extends Vue {
    @Prop({ type: Object }) private pathSelector!: PathSelectorModel;
}
</script>

<style lang="scss" scoped>
.replic-path-selector {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto 3rem;
        grid-template-areas:
        "label ."
        "input button";
        &__input {
            grid-area: input;
            outline: 0;
        }
        &__button {
            grid-area: button;
            display: grid;
            grid-template-columns: 2rem 4rem;
            padding-inline-start: var(--space-xs);
            align-content: center;
            background: lightgrey;
            cursor: pointer;
            &:hover {
                background: var(--c-surf-3);
            }
        }
}
</style>
