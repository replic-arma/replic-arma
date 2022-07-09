import { createI18n } from 'vue-i18n';

import enLocale from '@/assets/locales/en.json';
import deLocale from '@/assets/locales/de.json';

const messages = {
    en: {
        ...enLocale,
    },
    de: {
        ...deLocale,
    }
};
const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages,
});

export default i18n;
