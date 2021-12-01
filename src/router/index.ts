import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ReposView from '../views/Repos.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: ReposView
    },
    {
        path: '/settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;
