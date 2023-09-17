import type { File } from '@/models/Repository';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useCacheStore = defineStore('cache', () => {
    const cache: Ref<Map<string, File>> = ref(new Map<string, File>());
});
