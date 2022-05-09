import type { Modset } from './Repository';

export interface DownloadItem {
    status: 'paused' | 'downloading' | 'queued';
    item: Modset;
    size: number;
    received: number;
    repoId: string;
}
