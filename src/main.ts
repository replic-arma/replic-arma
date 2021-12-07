import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import router from './router';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import { createPinia } from 'pinia';
import { useRepoStore } from './store/repo';
import { useDownloadStore } from './store/download';
import '@ui5/webcomponents/dist/Select';
import '@ui5/webcomponents/dist/Option';
const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(i18n);
app.use(mdiVue, {
    icons: mdijs
});

app.config.compilerOptions.isCustomElement = (tag) => /^ui5-/.test(tag);
app.mount('#app');

// ADD DEMO DATA
const repoStore = useRepoStore();
const downloadStore = useDownloadStore();
repoStore.addRepo(
    { build_date: '12.11', name: 'Anrop', open_repository_schema: 1, status: 'ready' }
);
repoStore.addRepo(
    {
        build_date: '12.11',
        name: 'Gruppe Adler',
        open_repository_schema: 1,
        status: 'ready',
        game_servers: [
            { name: 'Gruppe Adler Main', port: '2302', host: 'arma.gruppe-adler.de', password: 'helium', modset: 'Gruppe Adler Main' },
            { name: 'Gruppe Adler Test', port: '2402', host: 'arma.gruppe-adler.de', password: 'methan' },
            { name: 'Gruppe Adler Test', port: '2402', host: 'arma.gruppe-adler.de' }
        ],
        modsets: [
            { name: 'All Mods', status: 'ready', description: 'All Mods from the Repository', mods: [{ name: 'RHS', mod_type: 'asd' }] },
            { name: 'Gruppe Adler Main', status: 'ready', description: 'Hautprepo für die meisten Missionen', mods: [{ name: 'RHS', mod_type: 'asd' }] }
        ]
    }
);

downloadStore.addDownload({
    status: 'inProgress',
    size: 1337,
    item: {
        build_date: '12.11',
        name: 'Gruppe Adler',
        open_repository_schema: 1,
        status: 'ready',
        game_servers: [
            { name: 'Gruppe Adler Main', port: '2302', host: 'arma.gruppe-adler.de', password: 'helium', modset: 'Gruppe Adler Main' },
            { name: 'Gruppe Adler Test', port: '2402', host: 'arma.gruppe-adler.de', password: 'methan' },
            { name: 'Gruppe Adler Test', port: '2402', host: 'arma.gruppe-adler.de' }
        ],
        modsets: [
            { name: 'Gruppe Adler Main', status: 'ready', description: 'Hautprepo für die meisten Missionen', mods: [{ name: 'RHS', mod_type: 'asd' }] }
        ]
    }
}
);

downloadStore.addDownload({
    status: 'queued',
    size: 1337,
    item:
        { name: 'Gruppe Adler Main', status: 'ready', description: 'Hautprepo für die meisten Missionen', mods: [{ name: 'RHS', mod_type: 'asd' }] }

}
);
