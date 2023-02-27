import { listen } from '@tauri-apps/api/event';
import type { Event as TauriEvent } from '@tauri-apps/api/helpers/event';
import { invoke } from '@tauri-apps/api/tauri';
import TypedEventTarget from '../TypedEventTarget';

export async function pauseDownload(): Promise<void> {
    return await invoke('pause_download');
}

export async function downloadFiles(
    repoType: string,
    downloadServerUrl: string,
    targetPath: string,
    newFiles: string[],
    partialFiles: string[],
    numberConnections: number
): Promise<string> {
    return await invoke('download', {
        repoType: repoType.toUpperCase(),
        url: downloadServerUrl,
        targetPath,
        newFiles,
        partialFiles,
        numberConnections: 10
    });
}

interface DownloadProgressEventMap {
    download_report: CustomEvent<{ size: number }>;
    download_finished: CustomEvent<{ path: string }>;
}

export const DOWNLOAD_PROGRESS = new TypedEventTarget<DownloadProgressEventMap>();

await listen('download_report', (e: TauriEvent<number>) => {
    const size = e.payload;

    const event = new CustomEvent('download_report', { detail: { size } });
    DOWNLOAD_PROGRESS.dispatchTypedEvent('download_report', event);
});

await listen('download_finished', (e: TauriEvent<string>) => {
    const event = new CustomEvent('download_finished', { detail: { path: e.payload } });
    DOWNLOAD_PROGRESS.dispatchTypedEvent('download_finished', event);
});
