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
import { System } from './util/system';
import { useI18n } from 'vue-i18n';
const app = createApp(App, {
    setup() {
        const { t } = useI18n({ useScope: 'global' }); // call `useI18n`, and spread `t` from  `useI18n` returning
        return { t }; // return render context that included `t`
    },
});
app.component('rtransition', TransitionVue);
app.component('loader', LoaderVue);
app.component('Tooltip', TooltipVue);
app.use(router);
app.use(createPinia());
app.use(mdiVue, {
    icons: mdijs,
});
app.mount('#app');
System.init();
app.use(i18n);
