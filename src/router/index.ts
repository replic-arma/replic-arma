import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ReposView from '../views/Repos.vue';
import { useRepoStore } from '@/store/repo';

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
        path: '/repo/:repoId',
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
        path: '/repo/:repoId/modset/:modsetId',
        component: () => import(/* webpackChunkName: "modset" */ '../views/Modset.vue')
    },
    {
        path: '/repo/:repoId/collection/:collectionId',
        component: () => import(/* webpackChunkName: "collection" */ '../views/Collection.vue')
    },
    {
        path: '/reposettings/:repoId',
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
router.beforeEach((to, from, next) => {
    const repoStore = useRepoStore();
    repoStore.currentRepoId = 'repoId' in to.params ? (to.params.repoId as string) : null;
    repoStore.currentModsetId = 'modsetId' in to.params ? (to.params.modsetId as string) : null;
    repoStore.currentCollectionId = 'collectionId' in to.params ? (to.params.collectionId as string) : null;
    repoStore.currentModId = 'modId' in to.params ? (to.params.modId as string) : null;

    next();
});

export default router;
