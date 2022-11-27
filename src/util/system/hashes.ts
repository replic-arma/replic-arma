import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import type { Event as TauriEvent } from '@tauri-apps/api/helpers/event';
import TypedEventTarget from '../TypedEventTarget';
import { fileExists, removeFile } from './fs';
export interface HashResponseItem {
    current_size: number;
    file: string;
    percentage: number;
    size: number;
}

export interface HashResponse {
    complete: HashResponseItem[];
    extra: HashResponseItem[];
    missing: HashResponseItem[];
    outdated: HashResponseItem[];
}
const FILE_NAME = 'hashes.json';

export async function checkHashes(
    repoType: string,
    modDirectory: string,
    files: Array<Array<string | number>>,
    url: string
): Promise<HashResponse> {
    return invoke('file_check', { repoType, pathPrefix: modDirectory, fileInput: files, url });
}

export async function resetHashes(): Promise<void> {
    const exists = await fileExists(FILE_NAME);
    if (!exists) return;

    await removeFile(FILE_NAME);
}

interface HashingProgressEventMap {
    hash_calculated: CustomEvent<{ absolutePath: string; hash: string; lastModified: number; size: number }>;
    hash_failed: CustomEvent<{ absolutePath: string }>;
    outdated_file_count: CustomEvent<{ count: number }>;
    zsync_completed: CustomEvent<{ filename: string }>;
}

export const HASHING_PROGRESS = new TypedEventTarget<HashingProgressEventMap>();

listen('hash_calculated', (e: TauriEvent<{ hash: string; path: string; size: number; time_modified: number }>) => {
    const { path: absolutePath, hash, time_modified: lastModified, size } = e.payload;

    const event = new CustomEvent('hash_calculated', { detail: { absolutePath, hash, lastModified, size } });
    HASHING_PROGRESS.dispatchTypedEvent('hash_calculated', event);
});

listen('hash_failed', (e: TauriEvent<string>) => {
    const event = new CustomEvent('hash_failed', { detail: { absolutePath: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('hash_failed', event);
});

listen('outdated_file_count', (e: TauriEvent<number>) => {
    const event = new CustomEvent('outdated_file_count', { detail: { count: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('outdated_file_count', event);
});

listen('zsync_completed', (e: TauriEvent<string>) => {
    const event = new CustomEvent('zsync_completed', { detail: { filename: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('zsync_completed', event);
});
