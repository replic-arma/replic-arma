<template>
    <div>
        <ul class="tabs">
            <li class="tabs__item" v-for="(item, i) of tabItems" :key="i" @click="activeIndex = i">
                <span>{{item.label}}</span>
            </li>
        </ul>
        <component :is="tabItems[activeIndex].component" />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
export interface TabsItem {
    label: string;
    component: any;
}

@Options({
    components: { }
})
export default class TabsVue extends Vue {
    @Prop({ type: Array }) private tabItems!: TabsItem[];

    private activeIndex = 0;
}
</script>
<style lang="scss" scoped>
.tabs {
    list-style-type: none;
    border-bottom: 1px solid #333333;
    display: flex;
    padding: 0 0 1rem 0;
    position: relative;
    user-select: text;

    &__item {
        z-index: 1;

        > span {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 16pt;
            color: var(--c-text-1);
            height: 1.5rem;
            padding: .75rem .75rem;
            border-radius: .25rem;
        }
    }
}
</style>
