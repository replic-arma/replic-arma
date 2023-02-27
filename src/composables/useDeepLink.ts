import type { IReplicArmaRepository } from '@/models/Repository';

export interface DeepLinkContent {
    connection: {
        config_url: string;
        host_url: string;
        protocol: string;
    };
    info: unknown;
    version: number;
    creationDate: string;
}

export function useDeepLink() {
    function createDeepLink(repository: IReplicArmaRepository) {
        const data = {
            connection: {
                config_url: repository.config_url,
                host_url: '',
                protocol: 'http'
            },
            info: {},
            version: 1,
            creationDate: Date.now()
        };
        const encodedData = btoa(JSON.stringify(data));
        return `replicarma://${encodedData}`;
    }

    function parse(data: { payload: string }): DeepLinkContent {
        const url = new URL(data.payload);
        validate(url);
        const content = url.pathname.replaceAll('/', '');
        return JSON.parse(atob(content));
    }

    function validate(url: URL) {
        if (url.protocol !== 'replicarma:') {
            throw new Error('Protocol is not replicarma:');
        }
    }

    return { createDeepLink, parseDeepLink: parse };
}
