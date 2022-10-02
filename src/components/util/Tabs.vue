<template>
    <div id="tabs-container" :class="customClass" ref="tabContainer">
        <div id="tab-headers">
            <ul>
                <li
                    v-for="(tab, index) in tabs"
                    :key="index"
                    :class="activeTabIndex == index ? 'active' : ''"
                    @click="changeTab(index)"
                >
                    {{ tab.title }}
                </li>
            </ul>
        </div>
        <div id="active-tab">
            <slot></slot>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
defineProps(['customClass']);
const tabContainer = ref(null);

const tabs = ref(null);
const activeTabIndex = ref(0);

onMounted(() => {
    tabs.value = [...tabContainer.value.querySelectorAll('.tab')];
    for (const x of tabs.value) {
        if (x.classList.contains('active')) {
            activeTabIndex.value = tabs.value.indexOf(x);
        }
    }
    changeTab(0);
});
const changeTab = index => {
    activeTabIndex.value = index;
    for (const x of tabs.value) {
        x.classList.remove('active');
    }
    tabs.value[activeTabIndex.value].classList.add('active');
};
</script>

<style>
#tab-headers ul {
    margin: 0;
    padding: 0;
    display: flex;
    border-bottom: 2px solid transparent;
}
#tab-headers ul li {
    list-style: none;
    padding: 1rem 1.25rem;
    position: relative;
    cursor: pointer;
}
#tab-headers ul li.active {
    color: var(--c-surf-2);
    font-weight: bold;
}

#tab-headers ul li.active:after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    height: 2px;
    width: 100%;
    background: var(--c-surf-2);
}
#active-tab,
#tab-headers {
    width: 100%;
}

#active-tab {
    padding: 0.75rem;
}
</style>
