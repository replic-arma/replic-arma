import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import ReposView from '../views/Repos.vue';
import { useRepoStore } from '@/store/repo';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ReposView,
    },
    {
        path: '/settings',
        component: () => import('../views/Settings.vue'),
    },
    {
        path: '/repo/:repoId',
        component: () => import('../views/Repo.vue'),
        children: [
            {
                path: 'modsets',
                component: () => import('../views/ModsetList.vue'),
            },
            {
                path: 'servers',
                component: () => import('../views/ServerList.vue'),
            },
            {
                path: 'collections',
                component: () => import('../views/CollectionsList.vue'),
            },
        ],
    },
    {
        path: '/repo/:repoId/modset/:modsetId',
        component: () => import('../views/Modset.vue'),
    },
    {
        path: '/repo/:repoId/collection/:collectionId',
        component: () => import('../views/Collection.vue'),
    },
    {
        path: '/reposettings/:repoId',
        component: () => import('../views/RepoSettings.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});
router.beforeEach((to, from, next) => {
    const repoStore = useRepoStore();
    repoStore.currentRepoId = 'repoId' in to.params ? (to.params.repoId as string) : null;
    repoStore.currentModsetId = 'modsetId' in to.params ? (to.params.modsetId as string) : null;
    repoStore.currentCollectionId = 'collectionId' in to.params ? (to.params.collectionId as string) : null;
    repoStore.currentModId = 'modId' in to.params ? (to.params.modId as string) : null;

    next();
});

export default router;
