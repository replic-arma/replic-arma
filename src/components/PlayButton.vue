<template>
    <div class="button play" @click="play()">
        <span v-t="'play'"></span>
        <mdicon name="play" size="25" />
    </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['play']);
function play() {
    emit('play');
}
</script>
<style lang="scss" scoped>
.play {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 5rem;
    color: grey;
    & > span:first-child {
        color: var(--c-surf-2);
    }
    &:hover {
        transition: all 0.1s ease-in;
        background-color: var(--c-surf-3);
    }
}
</style>
