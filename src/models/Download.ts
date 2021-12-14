import { Modset, ReplicArmaRepository } from './Repository';

export interface DownloadItem {
    status: 'finished'|'queued'|'paused'|'inProgress';
    item: Modset;
    size: number;
    done: number;
    total: number;
}
