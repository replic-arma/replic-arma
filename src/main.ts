import { createApp } from 'vue';
import App from './App.vue';
import i18n from './plugins/i18n';
import router from './router';
import mdiVue from 'mdi-vue/v3';
import * as mdijs from '@mdi/js';
import { createPinia } from 'pinia';
import { useRepoStore } from './store/repo';
import { useDownloadStore } from './store/download';
import { v4 as uuidv4 } from 'uuid';
import TransitionVue from './components/util/Transition.vue';

const app = createApp(App);
app.component('rtransition', TransitionVue);
app.use(router);
app.use(createPinia());
app.use(i18n);
app.use(mdiVue, {
    icons: mdijs
});
app.mount('#app');

// ADD DEMO DATA
const repoStore = useRepoStore();
const downloadStore = useDownloadStore();
repoStore.addRepo(
    {
        id: 'f8db290f-bd3b-478e-97a4-7ed1a8adafe0',
        build_date: '12.11',
        name: 'TaskForce47',
        type: 'swifty',
        open_repository_schema: 1,
        image: 'https://forums.bohemia.net/uploads/profile/photo-774621.png',
        modsets: [{
            id: '297a29d0-e43f-480e-969a-91386037670a',
            name: 'All Mods',
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
        {
            id: 'b5810563-79d5-48bc-9048-993a384cf6ea',
            name: 'Private Main Modset',
            description: 'Private Modset',
            mods: [{ name: 'RHS', mod_type: uuidv4() }]
        }
        ]
    }
);
repoStore.addRepo(
    {
        id: '08b9132d-5894-4622-936f-7ceee438cf0c',
        build_date: '12.11',
        name: 'Anrop',
        type: 'a3s',
        open_repository_schema: 1,
        image: 'https://www.anrop.se/themes/Anrop2/images/logo-nav.png',
        modsets: [{
            id: '61d3b998-f7f5-4aae-9cbd-f2fcbdbf2a98',
            name: 'All Mods',
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
        {
            id: '581728f1-ae8a-4cb8-a7a7-3511867b6f70',
            name: 'Private Main Modset',
            description: 'Private Modset',
            mods: [{ name: 'RHS', mod_type: uuidv4() }]
        }
        ]
    }
);
repoStore.addRepo(
    {
        id: '3566ef17-af81-495f-af35-14b1d7306c4b',
        build_date: '12.11',
        name: 'Gruppe Adler',
        open_repository_schema: 1,
        image: "data:image/svg+xml,%3csvg width='282' height='286' viewBox='0 0 282 286' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3cpath d='M141 282C218.872 282 282 218.872 282 141C282 63.1279 218.872 0 141 0C63.1279 0 0 63.1279 0 141C0 218.872 63.1279 282 141 282Z' fill='white'/%3e %3cpath d='M141 270C212.245 270 270 212.245 270 141C270 69.7553 212.245 12 141 12C69.7553 12 12 69.7553 12 141C12 212.245 69.7553 270 141 270Z' fill='%23CECDC4'/%3e %3cpath d='M224.275 117.848L245.376 94.4342C250.622 103.494 259.957 136.403 266.739 169.95C253.68 226.902 202.922 269.473 142.132 269.995L145.798 246.042C145.798 246.042 138.571 246.331 130.622 252.98C132.212 244.597 153.024 225.231 153.024 225.231C153.024 225.231 156.926 204.563 157.938 191.989C158.886 180.209 157.551 159.547 157.378 156.987C156.423 159.443 130.947 171.904 108.654 165.397C80.1832 157.014 54.024 126.664 53.8795 116.113C53.4459 75.3568 165.887 12.9215 173.258 18.9916C187.566 30.6982 205.342 67.8414 224.275 117.848Z' fill='%23010103'/%3e %3cpath d='M228.322 60.4702L256.504 101.227C261.922 114.938 266.325 128.966 269.98 143.288C269.993 142.527 270 141.764 270 141C270 123.248 266.414 106.333 259.927 90.9401C248.97 79.2587 238.294 68.2351 228.322 60.4702Z' fill='%23010103'/%3e %3cpath d='M120.795 123.194C110.244 123.194 101.573 114.523 101.573 103.972C101.573 93.4221 110.244 84.7505 120.795 84.7505C131.49 84.7505 140.161 93.4221 140.161 103.972C140.161 114.523 131.49 123.194 120.795 123.194ZM120.795 91.8323C114.147 91.8323 108.799 97.1797 108.799 103.828C108.799 110.476 114.147 115.824 120.795 115.824C127.443 115.824 132.935 110.476 132.935 103.828C132.935 97.3243 127.443 91.8323 120.795 91.8323Z' fill='white'/%3e %3cpath d='M75.1243 110.621C111.256 91.6881 145.22 99.348 167.621 118.136C187.551 135.04 235.654 109.005 260.862 93.2203C241.875 45.6294 195.365 12 141 12C106.574 12 75.2969 25.4856 52.1643 47.4623C45.9029 75.4924 54.4571 99.7816 54.4571 99.7816C54.4571 99.7816 33.2118 132.589 75.1243 110.621Z' fill='%23CECDC4'/%3e %3cpath d='M173.981 68.13C100.272 90.5316 98.1044 67.2628 56.0473 104.551C49.5436 110.332 45.9304 104.984 43.9071 95.0119C37.2589 62.2044 61.6838 31.1313 95.0693 27.9517L184.38 19.4755C193.755 22.8222 202.629 27.223 210.86 32.535C202.491 45.9748 189.104 63.4898 173.981 68.13Z' fill='%23A7A49B'/%3e %3cpath d='M249.278 77.9578L249.423 77.8133C250.668 77.2685 251.536 76.2627 251.914 75.0892C245.75 64.7391 238.179 55.3248 229.464 47.1105L202.885 54.4C201.151 54.8336 199.995 56.7124 200.428 58.4468V58.5913L207.366 88.7973C207.366 88.9418 207.51 89.2308 207.51 89.3753C208.377 91.5432 210.69 92.6994 212.858 91.8323H213.002L248.989 78.1023L249.278 77.9578Z' fill='%23010103'/%3e %3cpath d='M206.498 68.7088L203.752 57.8694L232.127 49.6935C234.708 52.2696 237.181 54.9545 239.537 57.7407L206.498 68.7088Z' fill='%23010103'/%3e %3cpath d='M244.653 65.0948L209.244 79.2584L206.498 68.708L239.537 57.7401C241.123 59.6149 242.656 61.5356 244.134 63.4999L244.653 65.0948Z' fill='%23C1000C'/%3e %3cpath d='M209.244 79.2583L244.653 65.0947L247.255 73.4772L211.557 87.7853L209.244 79.2583Z' fill='%23EEB11B'/%3e %3cpath d='M49.9765 132.733L23.2391 142.85L12.6659 154.188C17.4961 201.755 48.1697 241.683 90.4248 259.708L104.607 218.293C104.607 218.293 142.184 176.669 162.996 161.494C165.308 159.76 166.32 156.436 164.73 153.834C157.938 142.706 128.888 148.487 115.591 156.58C73.1007 101.805 49.9765 132.733 49.9765 132.733Z' fill='%23D18D1F'/%3e %3cpath d='M87.2643 161.783C83.3621 166.408 62.2613 154.268 56.0467 150.51C55.324 150.076 55.4686 149.065 56.3357 148.776C61.3941 147.33 74.546 143.573 80.038 145.018C86.9753 147.041 91.8892 156.436 87.2643 161.783Z' fill='%23854205'/%3e %3cpath d='M83.0734 158.17C79.8939 161.783 60.6719 150.654 60.6719 149.787C60.6719 148.776 73.5347 145.596 78.1595 146.897C82.9289 148.053 86.253 154.412 83.0734 158.17Z' fill='%23010103'/%3e %3cpath fill-rule='evenodd' clip-rule='evenodd' d='M145.22 221.039C153.024 186.786 152.301 169.588 152.301 169.588C152.301 169.588 93.1902 213.957 84.9522 234.769C82.3574 241.324 80.967 248.253 80.2121 254.809C89.575 259.82 99.6284 263.71 110.193 266.298C118.483 249.859 130.064 232.379 145.22 221.039ZM122.052 268.618C125.471 269.122 128.934 269.491 132.435 269.72C132.465 269.603 132.494 269.486 132.524 269.368C132.548 269.271 132.573 269.175 132.597 269.078C132.617 269.001 132.636 268.924 132.655 268.847C132.682 268.74 132.709 268.633 132.736 268.526L132.74 268.51C133.426 265.79 134.094 263.142 134.669 260.495C132.027 262.619 128.401 264.798 124.383 267.213L124.379 267.215C124.379 267.216 124.378 267.216 124.377 267.217C123.614 267.675 122.838 268.142 122.052 268.618ZM63.3611 119.825L45.8313 118.029C47.3247 119.435 49.8405 120.941 50.9886 121.171C53.1565 121.749 54.8908 121.605 56.4806 121.46C58.9228 121.127 61.1945 120.539 63.3611 119.825Z' fill='%23010103'/%3e %3cpath d='M80.6165 112.355C85.3858 110.043 90.4443 108.453 95.5027 107.008C100.561 105.707 105.764 104.84 110.967 104.551C116.17 104.117 121.373 104.551 126.576 105.129C136.837 106.719 146.665 110.332 155.337 115.968C155.679 116.196 156.015 116.418 156.345 116.636C158.105 117.797 159.726 118.867 161.551 120.449L164.731 123.05C165.829 124.026 167.133 124.797 168.382 125.535C168.613 125.671 168.841 125.806 169.066 125.941C175.281 129.12 181.929 129.843 187.999 129.554C200.284 128.976 211.268 125.363 221.963 121.171C228.074 118.743 247.182 106.52 262.179 96.6638C260.949 93.3033 259.584 90.0082 258.089 86.7852C254.019 89.5009 249.842 92.0987 245.665 94.5786C236.416 100.071 226.877 105.274 217.194 109.465C207.51 113.656 197.249 117.269 187.421 117.992C182.507 118.281 177.883 117.847 174.125 116.113C173.258 115.679 172.246 115.101 171.523 114.523L168.199 112.066C166.176 110.476 163.285 108.598 160.828 107.152C150.712 101.082 139.439 97.3246 127.732 96.0239C121.951 95.4457 116.025 95.3012 110.244 96.0239C104.463 96.4574 98.8268 97.7581 93.1903 99.3479C87.6983 101.082 82.3508 103.106 77.2924 105.707C75.4783 106.59 73.7807 107.472 72.1374 108.327C68.9366 109.991 65.9421 111.547 62.6952 112.789C60.2383 113.801 57.7813 114.523 55.6134 114.957C54.6018 115.101 53.4455 115.101 52.8674 114.957C52.5299 114.788 52.4387 114.817 52.3925 114.783C52.3596 114.759 52.3495 114.704 52.2893 114.523C50.9886 110.043 59.0821 104.695 59.0821 104.695L54.7463 94.0005L58.504 91.399C85.89 68.7051 119.62 62.5695 146.664 57.6501C160.439 55.1445 172.478 52.9545 181.062 49.0528C189.778 45.0785 196.98 37.0677 202.814 27.7466C184.459 17.7072 163.396 12 141 12C69.7553 12 12 69.7553 12 141C12 151.572 13.2717 161.847 15.6705 171.68L49.9769 132.878C47.0684 129.837 45.732 121.838 45.0828 117.952L45.0386 117.687C44.9954 117.429 44.9555 117.193 44.9185 116.98C45.1266 117.307 45.4447 117.665 45.8313 118.029L63.3611 119.825C64.0153 119.61 64.6599 119.383 65.2967 119.148C68.7378 117.971 72.0088 116.396 75.145 114.887L75.495 114.719C77.2417 113.878 78.9468 113.064 80.6165 112.355Z' fill='%23010103'/%3e %3cpath d='M215.025 116.98C207.51 119.726 202.163 122.906 198.983 123.773C198.116 124.062 197.538 124.929 197.682 125.941C207.366 197.481 214.736 200.805 218.639 202.395C222.685 203.985 236.993 195.458 238.583 191.266C241.907 181.728 221.529 176.091 216.76 118.136C216.615 117.269 215.893 116.691 215.025 116.98ZM211.846 170.021C212.279 167.275 214.881 165.252 217.627 165.685C220.373 166.119 222.252 168.576 221.963 171.466C221.529 174.212 219.072 176.091 216.326 175.802C213.436 175.369 211.412 172.767 211.846 170.021ZM223.263 193.434C220.228 193.001 218.06 190.255 218.494 187.22C218.928 184.185 221.674 182.161 224.709 182.45C227.744 182.884 229.767 185.63 229.478 188.665C229.044 191.7 226.298 193.868 223.263 193.434Z' fill='%23CECDC4'/%3e %3cpath d='M162.851 151.955C162.851 151.955 157.793 156.868 106.775 197.047C97.8147 204.129 90.0103 226.241 90.0103 226.241L165.453 159.759C165.887 159.325 166.176 158.892 166.32 158.169C166.609 155.712 165.453 153.4 162.851 151.955Z' fill='%23854605'/%3e %3cpath opacity='0.81' d='M131.49 172.045C127.876 174.935 123.685 178.115 119.205 181.728C91.9354 204.228 82.4443 231.191 80.6454 255.039C82.5975 256.075 84.5795 257.061 86.5895 257.998C87.8568 234.889 96.5678 208.435 123.107 186.497C127.361 182.953 131.475 179.826 135.04 177.116L135.247 176.959C141.317 172.189 157.215 158.026 170.945 152.967L166.609 150.366C163.43 147.186 137.993 167.131 131.49 172.045Z' fill='%23010103'/%3e %3cpath fill-rule='evenodd' clip-rule='evenodd' d='M22.014 164.618L7.30996 181.249C-3.5295 192.956 8.17713 216.658 19.3056 227.786L77.6942 285.597C78.4303 284.076 78.4666 280.238 78.5159 275.018C78.605 265.583 78.7368 251.632 83.1202 238.676C47.7321 229.148 22 200.214 22 166C22 165.539 22.0047 165.078 22.014 164.618Z' fill='%23D18D1E'/%3e %3c/svg%3e",
        type: 'a3s',
        game_servers: [
            { name: 'Gruppe Adler Main', port: '2302', host: 'arma.gruppe-adler.de', password: 'helium', modset: 'Gruppe Adler Main' },
            { name: 'Gruppe Adler Test', port: '2402', host: 'arma.gruppe-adler.de', password: 'methan' },
            { name: 'Gruppe Adler Test', port: '2402', host: 'arma.gruppe-adler.de' }
        ],
        modsets: [
            {
                id: '581728f1-ae8a-4cb8-a8a7-3511867b6f68',
                name: 'All Mods',
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
            {
                id: '581728f1-ae8a-4cb8-a7a7-3511867b6f68',
                name: 'Gruppe Adler Main',
                description: 'Hautprepo für die meisten Missionen',
                mods: [{ name: 'RHS', mod_type: uuidv4() }]
            },
            {
                id: '581728f1-ae8a-4cb8-a7a7-3511867b6f69',
                name: 'Gruppe Adler Joint Ops',
                description: 'Tailored for each event',
                mods: [{ name: 'RHS', mod_type: uuidv4() }]
            }
        ]
    }
);

downloadStore.startDownload({
    status: 'inProgress',
    size: 1337,
    item: { id: '581728f1-ae8a-4cb8-a7a7-3511867b6f69', name: 'Gruppe Adler Joint Ops', description: 'Hautprepo für die meisten Missionen', mods: [{ name: 'RHS', mod_type: uuidv4() }] },
    done: 0,
    total: 0
}
);

downloadStore.addToQueue({
    status: 'queued',
    size: 1337,
    item: { id: 'eaadaa94-214b-4351-aeb9-17a4c1dee138', name: 'Gruppe Adler Main', description: 'Hautprepo für die meisten Missionen', mods: [{ name: 'RHS', mod_type: uuidv4() }] },
    done: 0,
    total: 0
}
);

console.log(uuidv4());
