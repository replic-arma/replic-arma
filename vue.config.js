// eslint-disable-next-line @typescript-eslint/no-var-requires
const WorkerPlugin = require('worker-plugin');
module.exports = {
    pluginOptions: {
        i18n: {
            locale: 'de',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableLegacy: false,
            runtimeOnly: false,
            compositionOnly: false,
            fullInstall: true
        }
    },
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: 'javascript/auto'
                }
            ]
        },
        plugins: [
            new WorkerPlugin()
        ]
    }
};
