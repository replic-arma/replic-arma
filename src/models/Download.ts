import type { Modset } from './Repository';

export interface DownloadItem {
    status: 'paused' | 'downloading';
    item: Modset;
    size: number;
    received: number;
    repoId: string;
}
