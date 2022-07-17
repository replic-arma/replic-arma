import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useRouteStore } from '@/store/route';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Repos.vue'),
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
        path: '/setup/moddirectory',
        component: () => import('../views/setup/ModDirectory.vue'),
    },
    {
        path: '/setup/executable',
        component: () => import('../views/setup/Executable.vue'),
    },
    {
        path: '/setup/firstRepository',
        component: () => import('../views/setup/FirstRepository.vue'),
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
    useRouteStore().switchRoute(to);

    next();
});
export default router;
