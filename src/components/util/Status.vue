<template>
    <div class="replic-status" :class="`status--${status}`">
        <template v-if="status === 'checking' || status === 'downloading'">
            <mdicon name="loading" spin />
        </template>
        <span v-t="'status.' + status"></span>
        <template v-if="progress !== null && (status === 'checking' || status === 'downloading')">
            <span>...{{ progress }}%</span>
        </template>
    </div>
</template>
<script lang="ts" setup>
interface Props {
    status: string;
    progress: number;
}
const props = defineProps<Props>();
</script>

<style lang="scss">
.replic-status {
    text-align: center;
    font-weight: 500;
}
</style>
