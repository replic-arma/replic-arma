import { appDir, sep } from '@tauri-apps/api/path';

import {
    BaseDirectory,
    createDir as tauriCreateDir,
    removeFile as tauriRemoveFile,
    readTextFile as tauriReadTextFile,
    readBinaryFile as tauriReadBinaryFile,
    writeFile as tauriWriteFile,
    writeBinaryFile as tauriWriteBinaryFile,
    readDir as tauriReadDir,
    type FileEntry
} from '@tauri-apps/api/fs';
import { invoke } from '@tauri-apps/api/tauri';

export const APP_DIR_PROMISE = appDir();

export function joinPath(path: string[]) {
    return path.join(sep);
}

async function prependAppDir(relativePath: string) {
    const appDir = await APP_DIR_PROMISE;
    return joinPath([appDir, relativePath]);
}

export async function fileExists(relativePath: string) {
    const path = await prependAppDir(relativePath);

    return invoke('file_exists', { path });
}

export async function readDir(relativePath: string): Promise<FileEntry[]> {
    const path = await prependAppDir(relativePath);

    return tauriReadDir(path, { dir: BaseDirectory.App });
}

export async function dirExists(relativePath: string): Promise<boolean> {
    const path = await prependAppDir(relativePath);

    return invoke('dir_exists', { path });
}

export async function createDir(relativePath: string): Promise<void> {
    const path = await prependAppDir(relativePath);

    return tauriCreateDir(path, { dir: BaseDirectory.App });
}

export async function removeFile(relativePath: string): Promise<void> {
    const path = await prependAppDir(relativePath);

    return tauriRemoveFile(path, { dir: BaseDirectory.App });
}

export async function readTextFile(relativePath: string): Promise<string> {
    const path = await prependAppDir(relativePath);

    return tauriReadTextFile(path, { dir: BaseDirectory.App });
}

export async function readBinaryFile(relativePath: string): Promise<Uint8Array> {
    const path = await prependAppDir(relativePath);

    return tauriReadBinaryFile(path, { dir: BaseDirectory.App });
}

export async function writeTextFile(relativePath: string, contents: string): Promise<void> {
    const path = await prependAppDir(relativePath);

    return tauriWriteFile({ contents, path }, { dir: BaseDirectory.App });
}

export async function writeBinaryFile(relativePath: string, contents: Uint8Array): Promise<void> {
    const path = await prependAppDir(relativePath);

    return tauriWriteBinaryFile({ contents, path }, { dir: BaseDirectory.App });
}

export async function ensureAppDir() {
    const exists = await dirExists('');

    if (!exists) createDir('');
}
