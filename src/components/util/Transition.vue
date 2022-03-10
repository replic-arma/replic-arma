<template>
    <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
            <component :is="Component" />
        </transition>
    </router-view>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
@Options({ components: { } })
export default class TransitionVue extends Vue {}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.01s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
