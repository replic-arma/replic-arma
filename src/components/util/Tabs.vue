<template>
    <div>
        <ul class="tabs">
            <li class="tabs__item"  v-for="(item, i) of tabItems" :key="i" @click="activeIndex = i">
                <span :class="{'active-tab': activeIndex === i}">{{item.label}}</span>
            </li>
        </ul>
        <component :is="tabItems[activeIndex].component" />
    </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
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
    public created (): void {
        this.onActiveTabChanged();
    }

    @Watch('activeIndex')
    private onActiveTabChanged () {
        this.$nextTick(() => {
            const anchor = this.$el.querySelector('.active-tab') as HTMLAnchorElement;
            if (anchor === null) return;
            const el = anchor.parentElement as HTMLLIElement;

            const bb = el.getBoundingClientRect();
            const parentBB = this.$el.getBoundingClientRect();

            const left = bb.left - parentBB.left;
            const width = bb.width;
            (this.$el as HTMLUListElement).style.setProperty('--subnavi-left', `${left}px`);
            (this.$el as HTMLUListElement).style.setProperty('--subnavi-width', `${width}px`);
        });
    }
}
</script>
<style lang="scss" scoped>
.tabs {
    list-style-type: none;
    border-bottom: 1px solid #333333;
    display: flex;
    gap: .5rem;
    padding-block-end: var(--space-md);
    padding-inline-start: 0;
    position: relative;
    user-select: text;

    &__item {
        z-index: 1;
        cursor: pointer;
        > span {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 16pt;
            color: var(--c-text-1);
            padding-inline: 1rem;
            height: 1.5rem;
            block-size: 3.25rem;
            border-radius: .25rem;
        }
    }
    &::before {
        block-size: 3.25rem;
        content: '';
        position: absolute;
        inset-block: 0;
        inset-inline-start: var(--subnavi-left, 0);
        inline-size: var(--subnavi-width, 0px);
        background: var(--c-surf-3);
        border-radius: 1rem;
        z-index: 0;
        transition: all 0.07s ease-out;
    }
}
</style>
