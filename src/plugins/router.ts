import { useRouteStore } from '@/store/route';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/Repositories.vue')
    },
    {
        path: '/repo/:repoId',
        component: () => import('../views/Repository.vue'),
        children: [
            {
                path: 'modsets',
                component: () => import('../views/Repository/Modsets.vue')
            },
            {
                path: 'servers',
                component: () => import('../views/Repository/Servers.vue')
            },
            {
                path: 'collections',
                component: () => import('../views/Repository/Collections.vue')
            }
        ]
    },
    {
        path: '/repo/:repoId/modset/:modsetId',
        component: () => import('../views/Modset.vue'),
        children: [
            {
                path: 'mods',
                component: () => import('../views/Modset/Mods.vue')
            }
        ]
    },
    {
        path: '/repo/:repoId/collection/:collectionId',
        component: () => import('../views/Collection.vue'),
        children: [
            {
                path: 'mods',
                component: () => import('../views/Collection/Mods.vue')
            },
            {
                path: 'edit',
                component: () => import('../views/Collection/Edit.vue')
            }
        ]
    },
    {
        path: '/setup',
        component: () => import('../views/Setup.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});
router.beforeEach((to, from, next) => {
    useRouteStore().switchRoute(to);

    next();
});
export default router;
