import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteLocation } from 'vue-router';

export const useRouteStore = defineStore('route', () => {
    const currentRepoID = ref(null as string | null);
    const currentModsetID = ref(null as string | null);
    const currentCollectionID = ref(null as string | null);

    function switchRoute(route: RouteLocation) {
        currentRepoID.value = (route.params.repoId as string | undefined) ?? null;
        currentModsetID.value = (route.params.modsetId as string | undefined) ?? null;
        currentCollectionID.value = (route.params.collectionId as string | undefined) ?? null;
    }

    return {
        currentRepoID,
        currentModsetID,
        currentCollectionID,
        switchRoute
    };
});
