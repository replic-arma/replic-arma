<template>
    <li class="modlist-item">
        <Popper :hover="true" :arrow="true">
            <div>
                <mdicon
                    v-if="displayIcon"
                    :name="isOutdated ? 'close' : 'check'"
                    :class="`status--${isOutdated ? 'outdated' : 'ready'}`"
                />
                <span>{{ name }}</span>
            </div>
            <template #content>
                <div>{{ path }}</div>
                <div>{{ size }}</div>
            </template>
        </Popper>
    </li>
</template>

<script lang="ts" setup>
import Popper from 'vue3-popper';
defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String
    },
    path: {
        type: String
    },
    isOutdated: {
        type: Boolean
    },
    displayIcon: {
        type: Boolean
    }
});
</script>

<style lang="scss">
.modlist-item {
    background: var(--c-surf-3);
    width: fit-content;
    border-radius: 999px;
    padding-inline: 0.5rem;
    padding-block: 0.25rem;
    margin-inline: 0.25rem;
    margin-block: 0.25rem;
    font-weight: bold;
}
</style>
