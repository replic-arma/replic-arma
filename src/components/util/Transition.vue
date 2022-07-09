<template>
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.125s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
