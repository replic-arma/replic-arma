<template>
    <div class="replic-checkbox">
        <label class="replic-checkbox__thumb" :for="'check-'+ label"><mdicon v-if="model" name="check" /></label>
        <input class="replic-checkbox__check" type="checkbox" :id="'check-'+ label" :value="value" @change="handleInput">
        <label class="replic-checkbox__label" :for="'check-'+ label"><span>{{label}}</span></label>
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: { }
})
export default class ReplicCheckboxVue extends Vue {
    @Prop({ type: String }) private label!: string;
    @Prop({ type: Object }) private value!: any;
    private model = false;
    public handleInput (e: any) {
        this.model = !this.model;
        this.$emit('bing', this.value);
    }
}
</script>

<style lang="scss">
.replic-checkbox {
    display: inline-flex;
    &__check {
        display: none;
    }

    &__check:checked ~ div {
     display: block;
    }

    &__label {
        cursor: pointer;
        display: flex;
        align-items: center;
    }
    &__label span {
        margin-inline-start: 1rem;
    }
    &__thumb {
        content: "";
        block-size: 2rem;
        inline-size: 2rem;
        border-radius: 2rem;
        background: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
}

</style>
