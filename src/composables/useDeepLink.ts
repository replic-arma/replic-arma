export function useDeepLink() {
    function createDeepLink() {
        const data = {
            connection: {
                config_url: 'Test',
                host_url: 'http://gruppe-adler.de',
                protocol: 'http'
            },
            info: {},
            version: 1,
            creationDate: '2022-05-10'
        };
        const encodedData = btoa(JSON.stringify(data));
        return `replicarma://${encodedData}`;
    }

    function parse(data: { payload: string }) {
        const url = new URL(data.payload);
        validate(url);
        const content = url.pathname.replaceAll('/', '');
        return JSON.parse(atob(content));
    }

    function validate(url: URL) {
        if (url.protocol !== 'replicarma:') {
            // TODO throw error
        }
    }

    return { createDeepLink, parseDeepLink: parse };
}
