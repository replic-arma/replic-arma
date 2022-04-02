import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import router from './router';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import { createPinia } from 'pinia';
import TransitionVue from './components/util/Transition.vue';
import LoaderVue from './components/util/Loader.vue';
import TooltipVue from './components/util/Tooltip.vue';
import { useRepoStore } from './store/repo';
import { useSettingsStore } from './store/settings';
import { HASHING_PROGRESS } from './util/system/hashes';
import { useHashStore } from './store/hash';
import { DOWNLOAD_PROGRESS } from './util/system/download';
import { useDownloadStore } from './store/download';
const app = createApp(App);
app.component('rtransition', TransitionVue);
app.component('loader', LoaderVue);
app.component('Tooltip', TooltipVue);
app.use(router);
app.use(createPinia());
app.use(mdiVue, {
    icons: mdijs,
});
app.mount('#app');

useRepoStore();
useSettingsStore();
HASHING_PROGRESS.addEventListener('hash_calculated', () => {
    const current = useHashStore().current;
    if (current !== null) {
        current.checkedFiles += 1;
    }
});

DOWNLOAD_PROGRESS.addEventListener('download_report', (data) => {
    const current = useDownloadStore().current;
    if (current !== null) {
        current.received += data.detail.size;
        useDownloadStore().speeds.push(data.detail.size);
    }
});
DOWNLOAD_PROGRESS.addEventListener('download_finished', (data) => {
    const current = useDownloadStore().current;
    if (current !== null) {
        const cacheData = useHashStore().cache.find((cacheItem) => cacheItem.id === current.item.id);
        if (cacheData !== undefined) {
            cacheData.missingFiles = cacheData.missingFiles.filter((path) => path !== data.detail.path);
            cacheData.outdatedFiles = cacheData.outdatedFiles.filter((path) => path !== data.detail.path);
        }
    }
});
app.use(i18n);
