import type { ConnectionSettings } from './Repository';
interface DeepLinkInfo {
    repositoryName: string;
    modsetName: string;
}
export interface DeepLink {
    connection: ConnectionSettings;
    info: DeepLinkInfo;
    version: number;
    creationDate: string;
}
