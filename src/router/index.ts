import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ReposView from '../views/Repos.vue';
import RepoView from '../views/Repo.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ReposView
    },
    {
        path: '/settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
    },
    {
        path: '/repo/:id',
        component: RepoView,
        children: [
            {
                path: 'modsets',
                component: () => import(/* webpackChunkName: "modsets" */ '../views/ModsetList.vue')
            },
            {
                path: 'servers',
                component: () => import(/* webpackChunkName: "servers" */ '../views/ServerList.vue')
            }
        ]
    },
    {
        path: '/repo/:id/modset/:mid',
        component: () => import(/* webpackChunkName: "modset" */ '../views/Modset.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
