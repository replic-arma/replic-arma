import { Modset } from './Repository';

export interface DownloadItem {
    status: 'finished'|'paused'|'downloading';
    item: Modset;
    size: number;
    done: number;
    repoId: string;
}
