import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import ReposView from '../views/Repos.vue';
import { useRouteStore } from '@/store/route';

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
    useRouteStore().switchRoute(to);

    next();
});

export default router;
