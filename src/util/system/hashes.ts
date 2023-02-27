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
    return await invoke('file_check', { repoType, pathPrefix: modDirectory, fileInput: files, url });
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
