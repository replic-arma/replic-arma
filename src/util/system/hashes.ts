import { listen } from '@tauri-apps/api/event';
import TypedEventTarget from '../TypedEventTarget';
import { fileExists, removeFile } from './fs';
import { invoke } from '@tauri-apps/api';
import type { Event as TauriEvent } from '@tauri-apps/api/helpers/event';

const FILE_NAME = 'hashes.json';

export async function checkHashes(modDirectory: string, files: string[]): Promise<Array<Array<Array<string>>>> {
    return invoke('hash_check', { pathPrefix: modDirectory, files });
}

export async function resetHashes(): Promise<void> {
    const exists = await fileExists(FILE_NAME);
    if (!exists) return;

    await removeFile(FILE_NAME);
}

interface HashingProgressEventMap {
    hash_calculated: CustomEvent<{ absolutePath: string; hash: string; lastModified: number; size: number }>;
    hash_failed: CustomEvent<{ absolutePath: string }>;
}

export const HASHING_PROGRESS = new TypedEventTarget<HashingProgressEventMap>();

listen('hash_calculated', (e: TauriEvent<[string, string, number, number]>) => {
    const [absolutePath, hash, lastModified, size] = e.payload;

    const event = new CustomEvent('hash_calculated', { detail: { absolutePath, hash, lastModified, size } });
    HASHING_PROGRESS.dispatchTypedEvent('hash_calculated', event);
});

listen('hash_failed', (e: TauriEvent<string>) => {
    const event = new CustomEvent('hash_failed', { detail: { absolutePath: e.payload } });
    HASHING_PROGRESS.dispatchTypedEvent('hash_failed', event);
});
