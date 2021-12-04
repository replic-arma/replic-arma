import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import router from './router';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import { createPinia } from 'pinia';
import { useRepoStore } from './store/repo';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(i18n);
app.use(mdiVue, {
    icons: mdijs
});
app.mount('#app');

const repoStore = useRepoStore();
repoStore.addRepo({ build_date: '12.11', name: 'Anrop', open_repository_schema: 1, status: 'ready' });
repoStore.addRepo({ build_date: '12.11', name: 'Gruppe Adler', open_repository_schema: 1, status: 'ready' });
