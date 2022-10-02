<template>
    <div class="replic-status" :class="`status--${status}`">
        <template v-if="status === HashStatus.CHECKING || status === DownloadStatus.DOWNLOADING">
            <mdicon name="loading" spin />
        </template>
        <span v-t="'status.' + status"></span>
        <template v-if="progress !== null && (status === HashStatus.CHECKING || status === DownloadStatus.DOWNLOADING)">
            <span>...{{ progress }}%</span>
        </template>
    </div>
</template>
<script lang="ts" setup>
import { HashStatus } from '@/models/Repository';
import { DownloadStatus } from '@/models/Download';

interface Props {
    status: string;
    progress: number;
}
defineProps<Props>();
</script>

<style lang="scss">
.replic-status {
    text-align: center;
    font-weight: 500;
}
</style>
