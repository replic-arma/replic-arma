<template>
    <div class="replic-status" :class="`status--${status}`">
        <template v-if="status === 'checking' || status === 'downloading'">
            <mdicon name="loading" spin />
        </template>
        <span v-t="'download-status.' + status"></span>
        <template v-if="progress !== null && (status === 'checking' || status === 'downloading')">
            <span>...{{ progress }}%</span>
        </template>
    </div>
</template>
<script lang="ts" setup>
const props = defineProps({
    status: {
        type: String,
        default: null,
    },
    progress: {
        type: Number,
        default: null,
    },
});
</script>

<style lang="scss">
.replic-status {
    display: flex;
    font-weight: 500;
}
</style>
