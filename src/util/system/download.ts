import { invoke } from '@tauri-apps/api/tauri';
import TypedEventTarget from '../TypedEventTarget';
import type { Event as TauriEvent } from '@tauri-apps/api/helpers/event';
import { listen } from '@tauri-apps/api/event';

export async function pauseDownload(): Promise<void> {
    return await invoke('pause_download');
}

export async function downloadFiles(
    repoType: string,
    downloadServerUrl: string,
    targetPath: string,
    files: string[]
): Promise<string> {
    return await invoke('download', {
        repoType: repoType.toUpperCase(),
        url: downloadServerUrl,
        targetPath,
        fileArray: files,
    });
}

interface DownloadProgressEventMap {
    download_report: CustomEvent<{ size: number }>;
    download_finished: CustomEvent<{ path: string }>;
}

export const DOWNLOAD_PROGRESS = new TypedEventTarget<DownloadProgressEventMap>();

listen('download_report', (e: TauriEvent<number>) => {
    const size = e.payload;

    const event = new CustomEvent('download_report', { detail: { size } });
    DOWNLOAD_PROGRESS.dispatchTypedEvent('download_report', event);
});

listen('download_finished', (e: TauriEvent<string>) => {
    const event = new CustomEvent('download_finished', { detail: { path: e.payload } });
    DOWNLOAD_PROGRESS.dispatchTypedEvent('download_finished', event);
});
