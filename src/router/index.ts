import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ReposView from '../views/Repos.vue';
import RepoView from '../views/Repo.vue';
import RepoSettingsView from '../views/RepoSettings.vue';

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
        component: () => import(/* webpackChunkName: "repo" */ '../views/Repo.vue'),
        children: [
            {
                path: 'modsets',
                component: () => import(/* webpackChunkName: "modsets" */ '../views/ModsetList.vue')
            },
            {
                path: 'servers',
                component: () => import(/* webpackChunkName: "servers" */ '../views/ServerList.vue')
            },
            {
                path: 'collections',
                component: () => import(/* webpackChunkName: "collections" */ '../views/CollectionsList.vue')
            }
        ]
    },
    {
        path: '/repo/:id/modset/:mid',
        component: () => import(/* webpackChunkName: "modset" */ '../views/Modset.vue')
    },
    {
        path: '/reposettings/:id',
        component: () => import(/* webpackChunkName: "repoSettings" */ '../views/RepoSettings.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
