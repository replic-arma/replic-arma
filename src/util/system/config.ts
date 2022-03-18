import type { IApplicationSettings } from '@/models/Settings';
import { ensureAppDir, fileExists, readTextFile, removeFile, writeTextFile } from './fs';

const FILE_NAME = 'config.json';

const DEFAULT_CONFIG: IApplicationSettings = {
    language: 'en',
    gamePath: '',
    downloadDirectoryPath: '',
    theme: 'light',
    maxDownloadSpeed: 0,
};

export async function loadConfig(): Promise<IApplicationSettings> {
    const exists = await fileExists(FILE_NAME);
    if (!exists) return DEFAULT_CONFIG;

    const str = await readTextFile(FILE_NAME);
    return JSON.parse(str);
}

export async function saveConfig(contents: IApplicationSettings): Promise<void> {
    await ensureAppDir();

    return writeTextFile(FILE_NAME, JSON.stringify(contents));
}

export async function resetConfig(): Promise<IApplicationSettings> {
    const exists = await fileExists(FILE_NAME);

    if (!exists) {
        removeFile(FILE_NAME);
    }

    return DEFAULT_CONFIG;
}
