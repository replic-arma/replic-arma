<template>
    <ul class="subnavi">
        <li class="subnavi__item" v-for="(item, i) of subnaviItems" :key="i">
            <router-link :to="item.link">{{item.label}}</router-link>
        </li>
    </ul>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
export interface SubnaviItem {
    label: string;
    link: string;
}

@Options({
    components: { }
})
export default class Subnavi extends Vue {
    @Prop({ type: Array }) private subnaviItems!: SubnaviItem[];
}
</script>
<style lang="scss" scoped>
.subnavi {
    list-style-type: none;
    &__item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        color: #333333;
        float: left;
        width: 98px;
        height: 37px;
        padding: 8px 12px;
        border-radius: 12px;
        &:hover {
            background: rgba(0, 0, 0, 0.1);
        }
    }
}
</style>
