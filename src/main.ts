import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import router from './router';
import store from './store';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
const app = createApp(App);
app.use(store);
app.use(router);
app.use(i18n);
app.use(mdiVue, {
    icons: mdijs
});
app.mount('#app');
