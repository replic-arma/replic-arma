<template>
<mdicon name="dots-vertical" @click="isOpen = true" size="55"></mdicon>
    <Teleport v-if="isOpen" to="#modal-target">
        <div class="replic-dialog">
            <div class="replic-dialog__heading">
                <span v-t="'settings.title'"></span>
                <mdicon role="button" @click="isOpen = false" name="close" size="35" />
            </div>
            <div class="replic-dialog__content">
                <template v-if="repository">
                    <small v-once>Build Date: {{ formatDate(repository.build_date) }}</small>
                    <small v-once>Revision: {{ repository.revision }}</small>
                </template>
                <Launch></Launch>
                <button class="button button--danger" v-once @click="removeRepo()" v-t="'remove'"></button>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts" setup>
import type { IReplicArmaRepository } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Toast from '../util/Toast';
import Launch from './Launch.vue';
const repository = useRepoStore().currentRepository;
const router = useRouter();
function removeRepo(): void {
    useRepoStore().repos =
        useRepoStore().repos?.filter((repo: IReplicArmaRepository) => repo.id !== repository?.id) ?? [];
    useRepoStore().save();
    Toast('Removed Repository ' + repository?.name);
    router.push('/');
}

const isOpen = ref(false);
function formatDate(timestamp: string) {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('de-de');
}
</script>
<style lang="scss" scoped>
.replic-dialog {
    height: fit-content;
    width: 75%;
    &__heading {
        display: grid;
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
