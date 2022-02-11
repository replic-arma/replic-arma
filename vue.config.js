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
                },
                {
                    test: /\.worker\.(js|ts)$/i,
                    use: [{
                        loader: 'comlink-loader',
                        options: {
                            singleton: true
                        }
                    }]
                }
            ]
        }
    }
};
