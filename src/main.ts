import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import router from './router';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import { createPinia } from 'pinia';
import { useRepoStore } from './store/repo';
import { useDownloadStore } from './store/download';

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
    {
        build_date: '12.11',
        name: 'Anrop',
        open_repository_schema: 1,
        status: 'ready',
        modsets: [{
            name: 'All Mods',
            status: 'ready',
            description: 'All Mods from the Repository',
            mods: [{
                name: '@3cb factions',
                mod_type: 'Khaki'
            }, {
                name: '@3cb_baf_equipment',
                mod_type: 'Pink'
            }, {
                name: '@3cb_baf_units',
                mod_type: 'Pink'
            }, {
                name: '@3cb_baf_vehicles',
                mod_type: 'Indigo'
            }, {
                name: '@3cb_baf_weapons',
                mod_type: 'Orange'
            }, {
                name: '@3cb_factions',
                mod_type: 'Pink'
            }, {
                name: '@3cb_fortifications',
                mod_type: 'Fuscia'
            }, {
                name: '@3cb_map',
                mod_type: 'Teal'
            }, {
                name: '@3den enhanced',
                mod_type: 'Pink'
            }, {
                name: '@3den_Enhanced',
                mod_type: 'Puce'
            }, {
                name: '@ACE_Compat-RHSAFRF',
                mod_type: 'Orange'
            }, {
                name: '@ACE_Compat-RHSGREF',
                mod_type: 'Violet'
            }, {
                name: '@ACE_Compat-RHSSAF',
                mod_type: 'Fuscia'
            }, {
                name: '@ACE_Compat-RHSUSAF',
                mod_type: 'Blue'
            }, {
                name: '@ACRE Animations',
                mod_type: 'Green'
            }, {
                name: '@Breaching_Charge',
                mod_type: 'Turquoise'
            }, {
                name: '@Brush_Clearing',
                mod_type: 'Crimson'
            }, {
                name: '@CUP_ACE3_Compatibility_Addon-Terrains',
                mod_type: 'Turquoise'
            }, {
                name: '@CUP_Terrains-Core',
                mod_type: 'Aquamarine'
            }, {
                name: '@CUP_Terrains-Maps',
                mod_type: 'Pink'
            }, {
                name: '@DUI-Squad_Radar',
                mod_type: 'Purple'
            }, {
                name: '@Deutsche Arma Allianz - Kernmod',
                mod_type: 'Indigo'
            }, {
                name: '@Deutsche_Arma_Allianz-Kernmod',
                mod_type: 'Goldenrod'
            }, {
                name: '@Enhanced Movement Rework',
                mod_type: 'Red'
            }, {
                name: '@Enhanced_Movement_Rework',
                mod_type: 'Turquoise'
            }, {
                name: '@FFAA MOD',
                mod_type: 'Orange'
            }, {
                name: '@GRAD_Sling_Helmet',
                mod_type: 'Maroon'
            }, {
                name: '@Gruppe_Adler_Admin_Messages',
                mod_type: 'Fuscia'
            }, {
                name: '@Gruppe_Adler_Trenches',
                mod_type: 'Blue'
            }, {
                name: '@ILBE_Assault_Pack-Rewrite',
                mod_type: 'Yellow'
            }, {
                name: '@Immerse',
                mod_type: 'Crimson'
            }, {
                name: '@LAMBS_Danger.fsm',
                mod_type: 'Red'
            }, {
                name: '@RKSL_attachments',
                mod_type: 'Teal'
            }, {
                name: '@TBMod_Workshop',
                mod_type: 'Teal'
            }, {
                name: '@Task_Force_Arrowhead_Radio_BETA',
                mod_type: 'Red'
            }, {
                name: '@USAF Mod - Main',
                mod_type: 'Violet'
            }, {
                name: '@USAF_AC130_BETA',
                mod_type: 'Indigo'
            }, {
                name: '@ZEC',
                mod_type: 'Crimson'
            }, {
                name: '@ZEI',
                mod_type: 'Blue'
            }, {
                name: '@Zeus_Enhanced',
                mod_type: 'Indigo'
            }, {
                name: '@Zeus_Enhanced-ACE3_Compatibility',
                mod_type: 'Purple'
            }, {
                name: '@ace',
                mod_type: 'Yellow'
            }, {
                name: '@ace compat - sog',
                mod_type: 'Aquamarine'
            }, {
                name: '@ace-opt',
                mod_type: 'Yellow'
            }, {
                name: '@ace_compat_gm',
                mod_type: 'Aquamarine'
            }, {
                name: '@ace_compat_rhs_afrf3',
                mod_type: 'Pink'
            }, {
                name: '@ace_compat_rhs_gref3',
                mod_type: 'Crimson'
            }, {
                name: '@ace_compat_rhs_saf3',
                mod_type: 'Fuscia'
            }, {
                name: '@ace_compat_rhs_usf3',
                mod_type: 'Goldenrod'
            }, {
                name: '@ace_compat_sog',
                mod_type: 'Turquoise'
            }, {
                name: '@ace_nouniformrestrictions',
                mod_type: 'Mauv'
            }, {
                name: '@ace_optionals',
                mod_type: 'Blue'
            }, {
                name: '@ace_particles',
                mod_type: 'Puce'
            }, {
                name: '@ace_vanillamedical',
                mod_type: 'Pink'
            }, {
                name: '@acex',
                mod_type: 'Teal'
            }, {
                name: '@acre',
                mod_type: 'Green'
            }, {
                name: '@acre2',
                mod_type: 'Red'
            }, {
                name: '@advanced towing',
                mod_type: 'Teal'
            }, {
                name: '@advanced_rappelling',
                mod_type: 'Indigo'
            }, {
                name: '@advanced_sling_loading',
                mod_type: 'Mauv'
            }, {
                name: '@advanced_towing',
                mod_type: 'Teal'
            }, {
                name: '@advanced_urban_rappelling',
                mod_type: 'Green'
            }, {
                name: '@afi',
                mod_type: 'Blue'
            }, {
                name: '@afi_ace3',
                mod_type: 'Orange'
            }, {
                name: '@afi_aresmodachillesexpansion',
                mod_type: 'Indigo'
            }, {
                name: '@afi_cba_a3',
                mod_type: 'Indigo'
            }, {
                name: '@afi_dui_squad_radar',
                mod_type: 'Yellow'
            }, {
                name: '@afi_tfr',
                mod_type: 'Red'
            }, {
                name: '@afi_tun_firesupport',
                mod_type: 'Fuscia'
            }, {
                name: '@afi_tun_respawn_system',
                mod_type: 'Yellow'
            }, {
                name: '@afi_tun_startmarkers',
                mod_type: 'Purple'
            }, {
                name: '@anizay',
                mod_type: 'Blue'
            }, {
                name: '@arma 3 profiling branch companion mod',
                mod_type: 'Teal'
            }, {
                name: '@armazeuscache',
                mod_type: 'Yellow'
            }, {
                name: '@backpackonchest',
                mod_type: 'Teal'
            }, {
                name: '@blastcore_edited_sa',
                mod_type: 'Turquoise'
            }, {
                name: '@bundeswehr kleiderkammer (pbw)',
                mod_type: 'Crimson'
            }, {
                name: '@bwmod',
                mod_type: 'Mauv'
            }, {
                name: '@cba_a3',
                mod_type: 'Goldenrod'
            }, {
                name: '@cham',
                mod_type: 'Indigo'
            }, {
                name: '@cup ace3 compatibility addon - terrains',
                mod_type: 'Teal'
            }, {
                name: '@cup_terrains_core',
                mod_type: 'Khaki'
            }, {
                name: '@cup_terrains_maps',
                mod_type: 'Mauv'
            }, {
                name: '@cup_wheeledvehicles_suv',
                mod_type: 'Pink'
            }, {
                name: '@dcx_dmorchards_cdlc_crossover_mod',
                mod_type: 'Teal'
            }, {
                name: '@dhi_uniforms_and_equipment',
                mod_type: 'Green'
            }, {
                name: '@dismount_where_you_look',
                mod_type: 'Red'
            }, {
                name: '@distrikt_41_ruegen',
                mod_type: 'Purple'
            }, {
                name: '@diwako_dui',
                mod_type: 'Aquamarine'
            }, {
                name: '@dsai',
                mod_type: 'Fuscia'
            }, {
                name: '@dynasound2',
                mod_type: 'Green'
            }, {
                name: '@em_3CB',
                mod_type: 'Crimson'
            }, {
                name: '@em_buildings',
                mod_type: 'Purple'
            }, {
                name: '@enhanced gps',
                mod_type: 'Teal'
            }, {
                name: '@enhanced map ace version',
                mod_type: 'Puce'
            }, {
                name: '@enhanced_arma_3_inventory',
                mod_type: 'Mauv'
            }, {
                name: '@enhanced_movement',
                mod_type: 'Green'
            }, {
                name: '@enhanced_soundscape',
                mod_type: 'Indigo'
            }, {
                name: '@enhanced_video_settings',
                mod_type: 'Purple'
            }, {
                name: '@fallujah',
                mod_type: 'Mauv'
            }]
        }]
    }
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
            {
                name: 'All Mods',
                status: 'ready',
                description: 'All Mods from the Repository',
                mods: [{
                    name: '@3cb factions',
                    mod_type: 'Khaki'
                }, {
                    name: '@3cb_baf_equipment',
                    mod_type: 'Pink'
                }, {
                    name: '@3cb_baf_units',
                    mod_type: 'Pink'
                }, {
                    name: '@3cb_baf_vehicles',
                    mod_type: 'Indigo'
                }, {
                    name: '@3cb_baf_weapons',
                    mod_type: 'Orange'
                }, {
                    name: '@3cb_factions',
                    mod_type: 'Pink'
                }, {
                    name: '@3cb_fortifications',
                    mod_type: 'Fuscia'
                }, {
                    name: '@3cb_map',
                    mod_type: 'Teal'
                }, {
                    name: '@3den enhanced',
                    mod_type: 'Pink'
                }, {
                    name: '@3den_Enhanced',
                    mod_type: 'Puce'
                }, {
                    name: '@ACE_Compat-RHSAFRF',
                    mod_type: 'Orange'
                }, {
                    name: '@ACE_Compat-RHSGREF',
                    mod_type: 'Violet'
                }, {
                    name: '@ACE_Compat-RHSSAF',
                    mod_type: 'Fuscia'
                }, {
                    name: '@ACE_Compat-RHSUSAF',
                    mod_type: 'Blue'
                }, {
                    name: '@ACRE Animations',
                    mod_type: 'Green'
                }, {
                    name: '@Breaching_Charge',
                    mod_type: 'Turquoise'
                }, {
                    name: '@Brush_Clearing',
                    mod_type: 'Crimson'
                }, {
                    name: '@CUP_ACE3_Compatibility_Addon-Terrains',
                    mod_type: 'Turquoise'
                }, {
                    name: '@CUP_Terrains-Core',
                    mod_type: 'Aquamarine'
                }, {
                    name: '@CUP_Terrains-Maps',
                    mod_type: 'Pink'
                }, {
                    name: '@DUI-Squad_Radar',
                    mod_type: 'Purple'
                }, {
                    name: '@Deutsche Arma Allianz - Kernmod',
                    mod_type: 'Indigo'
                }, {
                    name: '@Deutsche_Arma_Allianz-Kernmod',
                    mod_type: 'Goldenrod'
                }, {
                    name: '@Enhanced Movement Rework',
                    mod_type: 'Red'
                }, {
                    name: '@Enhanced_Movement_Rework',
                    mod_type: 'Turquoise'
                }, {
                    name: '@FFAA MOD',
                    mod_type: 'Orange'
                }, {
                    name: '@GRAD_Sling_Helmet',
                    mod_type: 'Maroon'
                }, {
                    name: '@Gruppe_Adler_Admin_Messages',
                    mod_type: 'Fuscia'
                }, {
                    name: '@Gruppe_Adler_Trenches',
                    mod_type: 'Blue'
                }, {
                    name: '@ILBE_Assault_Pack-Rewrite',
                    mod_type: 'Yellow'
                }, {
                    name: '@Immerse',
                    mod_type: 'Crimson'
                }, {
                    name: '@LAMBS_Danger.fsm',
                    mod_type: 'Red'
                }, {
                    name: '@RKSL_attachments',
                    mod_type: 'Teal'
                }, {
                    name: '@TBMod_Workshop',
                    mod_type: 'Teal'
                }, {
                    name: '@Task_Force_Arrowhead_Radio_BETA',
                    mod_type: 'Red'
                }, {
                    name: '@USAF Mod - Main',
                    mod_type: 'Violet'
                }, {
                    name: '@USAF_AC130_BETA',
                    mod_type: 'Indigo'
                }, {
                    name: '@ZEC',
                    mod_type: 'Crimson'
                }, {
                    name: '@ZEI',
                    mod_type: 'Blue'
                }, {
                    name: '@Zeus_Enhanced',
                    mod_type: 'Indigo'
                }, {
                    name: '@Zeus_Enhanced-ACE3_Compatibility',
                    mod_type: 'Purple'
                }, {
                    name: '@ace',
                    mod_type: 'Yellow'
                }, {
                    name: '@ace compat - sog',
                    mod_type: 'Aquamarine'
                }, {
                    name: '@ace-opt',
                    mod_type: 'Yellow'
                }, {
                    name: '@ace_compat_gm',
                    mod_type: 'Aquamarine'
                }, {
                    name: '@ace_compat_rhs_afrf3',
                    mod_type: 'Pink'
                }, {
                    name: '@ace_compat_rhs_gref3',
                    mod_type: 'Crimson'
                }, {
                    name: '@ace_compat_rhs_saf3',
                    mod_type: 'Fuscia'
                }, {
                    name: '@ace_compat_rhs_usf3',
                    mod_type: 'Goldenrod'
                }, {
                    name: '@ace_compat_sog',
                    mod_type: 'Turquoise'
                }, {
                    name: '@ace_nouniformrestrictions',
                    mod_type: 'Mauv'
                }, {
                    name: '@ace_optionals',
                    mod_type: 'Blue'
                }, {
                    name: '@ace_particles',
                    mod_type: 'Puce'
                }, {
                    name: '@ace_vanillamedical',
                    mod_type: 'Pink'
                }, {
                    name: '@acex',
                    mod_type: 'Teal'
                }, {
                    name: '@acre',
                    mod_type: 'Green'
                }, {
                    name: '@acre2',
                    mod_type: 'Red'
                }, {
                    name: '@advanced towing',
                    mod_type: 'Teal'
                }, {
                    name: '@advanced_rappelling',
                    mod_type: 'Indigo'
                }, {
                    name: '@advanced_sling_loading',
                    mod_type: 'Mauv'
                }, {
                    name: '@advanced_towing',
                    mod_type: 'Teal'
                }, {
                    name: '@advanced_urban_rappelling',
                    mod_type: 'Green'
                }, {
                    name: '@afi',
                    mod_type: 'Blue'
                }, {
                    name: '@afi_ace3',
                    mod_type: 'Orange'
                }, {
                    name: '@afi_aresmodachillesexpansion',
                    mod_type: 'Indigo'
                }, {
                    name: '@afi_cba_a3',
                    mod_type: 'Indigo'
                }, {
                    name: '@afi_dui_squad_radar',
                    mod_type: 'Yellow'
                }, {
                    name: '@afi_tfr',
                    mod_type: 'Red'
                }, {
                    name: '@afi_tun_firesupport',
                    mod_type: 'Fuscia'
                }, {
                    name: '@afi_tun_respawn_system',
                    mod_type: 'Yellow'
                }, {
                    name: '@afi_tun_startmarkers',
                    mod_type: 'Purple'
                }, {
                    name: '@anizay',
                    mod_type: 'Blue'
                }, {
                    name: '@arma 3 profiling branch companion mod',
                    mod_type: 'Teal'
                }, {
                    name: '@armazeuscache',
                    mod_type: 'Yellow'
                }, {
                    name: '@backpackonchest',
                    mod_type: 'Teal'
                }, {
                    name: '@blastcore_edited_sa',
                    mod_type: 'Turquoise'
                }, {
                    name: '@bundeswehr kleiderkammer (pbw)',
                    mod_type: 'Crimson'
                }, {
                    name: '@bwmod',
                    mod_type: 'Mauv'
                }, {
                    name: '@cba_a3',
                    mod_type: 'Goldenrod'
                }, {
                    name: '@cham',
                    mod_type: 'Indigo'
                }, {
                    name: '@cup ace3 compatibility addon - terrains',
                    mod_type: 'Teal'
                }, {
                    name: '@cup_terrains_core',
                    mod_type: 'Khaki'
                }, {
                    name: '@cup_terrains_maps',
                    mod_type: 'Mauv'
                }, {
                    name: '@cup_wheeledvehicles_suv',
                    mod_type: 'Pink'
                }, {
                    name: '@dcx_dmorchards_cdlc_crossover_mod',
                    mod_type: 'Teal'
                }, {
                    name: '@dhi_uniforms_and_equipment',
                    mod_type: 'Green'
                }, {
                    name: '@dismount_where_you_look',
                    mod_type: 'Red'
                }, {
                    name: '@distrikt_41_ruegen',
                    mod_type: 'Purple'
                }, {
                    name: '@diwako_dui',
                    mod_type: 'Aquamarine'
                }, {
                    name: '@dsai',
                    mod_type: 'Fuscia'
                }, {
                    name: '@dynasound2',
                    mod_type: 'Green'
                }, {
                    name: '@em_3CB',
                    mod_type: 'Crimson'
                }, {
                    name: '@em_buildings',
                    mod_type: 'Purple'
                }, {
                    name: '@enhanced gps',
                    mod_type: 'Teal'
                }, {
                    name: '@enhanced map ace version',
                    mod_type: 'Puce'
                }, {
                    name: '@enhanced_arma_3_inventory',
                    mod_type: 'Mauv'
                }, {
                    name: '@enhanced_movement',
                    mod_type: 'Green'
                }, {
                    name: '@enhanced_soundscape',
                    mod_type: 'Indigo'
                }, {
                    name: '@enhanced_video_settings',
                    mod_type: 'Purple'
                }, {
                    name: '@fallujah',
                    mod_type: 'Mauv'
                }]
            },
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
