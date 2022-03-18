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

useRepoStore().loadRepositories(true);

app.use(i18n);
