import { createI18n } from 'vue-i18n';

import en from '@/assets/locales/en.json';
import de from '@/assets/locales/de.json';

type Schema = typeof en;

const i18n = createI18n<[Schema], 'de' | 'en'>({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { de, en },
});

export default i18n;
