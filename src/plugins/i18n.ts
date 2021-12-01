import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages (): LocaleMessages<VueMessageType> {
    const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages: LocaleMessages<VueMessageType> = {};
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i);
        if (matched && matched.length > 1) {
            const locale = matched[1];
            messages[locale] = locales(key).default;
        }
    });
    return messages;
}

/**
 * Get browser locale
 * @returns Locale
 */
function getBrowserLocale (): string|undefined {
    let browserLang: string|undefined = window.navigator.languages?.[0] ?? window.navigator.language;

    if (browserLang === undefined) return undefined;

    if (browserLang.indexOf('-') !== -1) {
        browserLang = browserLang.split('-')[0];
    }

    if (browserLang.indexOf('_') !== -1) {
        browserLang = browserLang.split('_')[0];
    }

    return browserLang;
}

const messages = loadLocaleMessages();
const browserLocale = getBrowserLocale();

const locale = browserLocale && browserLocale in messages ? browserLocale : 'en';

export default createI18n({ locale, fallbackLocale: 'en', messages });
