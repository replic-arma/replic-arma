<template>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'collection.add'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                {{ content }}
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import { useDeepLink, type DeepLinkContent } from '@/composables/useDeepLink';
import { useRepoStore } from '@/store/repo';
import { DEEP_LINK } from '@/util/system/deep-link';
import { ref } from 'vue';
const isOpen = ref(false);
const content = ref(null as null | DeepLinkContent);
DEEP_LINK.addEventListener('deep_link_received', data => {
    isOpen.value = true;
    content.value = parseDeepLink(data.detail);
    if (content.value === null) return;
    useRepoStore().addRepo(`${content.value.connection.config_url}autoconfig`);
});
const { parseDeepLink } = useDeepLink();
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
        font-weight: 600;
        grid-template-columns: 1fr auto;
        align-items: center;
        font-size: 20pt;
        margin-block-end: 2rem;
        span:not(:first-child) {
            cursor: pointer;
        }
    }
    &__content {
        display: grid;
        row-gap: 1rem;
    }
}
</style>
