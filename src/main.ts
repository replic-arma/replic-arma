import Notifications from '@kyvg/vue3-notification';
import * as mdijs from '@mdi/js';
import mdiVue from 'mdi-vue/v3';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import VueMatomo from 'vue-matomo';
import App from './App.vue';
import LoaderVue from './components/util/Loader.vue';
import TooltipVue from './components/util/Tooltip.vue';
import TransitionVue from './components/util/Transition.vue';
import i18n from './plugins/i18n';
import router from './plugins/router';
import { useDownloadStore } from './store/download';
import { useHashStore } from './store/hash';
import { useRepoStore } from './store/repo';
import { useSettingsStore } from './store/settings';
import { updateActivity } from './util/system/discord';

const app = createApp(App);
app.component('rtransition', TransitionVue);
app.component('loader', LoaderVue);
app.component('Tooltip', TooltipVue);
app.use(router);
app.use(createPinia());
app.use(mdiVue, {
    icons: mdijs
});
app.use(Notifications);
app.use(i18n);
app.mount('#app');
useSettingsStore();
useRepoStore();
useHashStore();
useDownloadStore();
app.use(VueMatomo, {
    host: 'https://analytics.gruppe-adler.de',
    siteId: 2,
    trackerFileName: 'matomo',
    router,
    enableLinkTracking: true,
    requireConsent: true,
    trackInitialView: true,
    disableCookies: false,
    requireCookieConsent: false,
    enableHeartBeatTimer: true,
    heartBeatTimerInterval: 15,
    debug: true,
    userId: undefined,
    cookieDomain: undefined,
    domains: undefined,
    preInitActions: [],
    trackSiteSearch: false,
    crossOrigin: undefined
});

updateActivity();
