import { useRouteStore } from '@/store/route';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../views/RepoList.vue')
    },
    {
        path: '/repo/:repoId',
        component: () => import('../views/Repo.vue'),
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
        path: '/setup/moddirectory',
        component: () => import('../views/setup/ModDirectory.vue')
    },
    {
        path: '/setup/executable',
        component: () => import('../views/setup/Executable.vue')
    },
    {
        path: '/setup/firstRepository',
        component: () => import('../views/setup/FirstRepository.vue')
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
