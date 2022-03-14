import type { Modset } from './Repository';

export interface DownloadItem {
    status: 'finished' | 'paused' | 'downloading';
    item: Modset;
    size: number;
    received: number;
    repoId: string;
}
