import { Modset, ReplicArmaRepository } from './Repository';

export interface DownloadItem {
    status: 'finished'|'queued'|'paused'|'inProgress';
    item: ReplicArmaRepository|Modset;
    size: number;
}
