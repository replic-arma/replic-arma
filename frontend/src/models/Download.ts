import type { Modset } from './Repository';

export enum DownloadStatus {
    PAUSED = 'paused',
    DOWNLOADING = 'downloading',
    QUEUED = 'queued',
    FINISHED = 'finished'
}

export interface DownloadItem {
    status: DownloadStatus;
    item: Modset;
    size: number;
    received: number;
    repoId: string;
}
