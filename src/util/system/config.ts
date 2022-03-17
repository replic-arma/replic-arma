import type { IApplicationSettings } from '@/models/Settings';
import { ensureAppDir, fileExists, readTextFile, writeTextFile } from './fs';

const FILE_NAME = 'config.json';

export async function loadFromJSON(): Promise<IApplicationSettings> {
    const exists = await fileExists(FILE_NAME);
    if (!exists)
        return {
            language: 'en',
            gamePath: '',
            downloadDirectoryPath: '',
            theme: 'light',
            maxDownloadSpeed: 0,
        };

    const str = await readTextFile(FILE_NAME);
    return JSON.parse(str);
}

export async function saveToJSON(contents: IApplicationSettings): Promise<void> {
    await ensureAppDir();

    return writeTextFile(FILE_NAME, JSON.stringify(contents));
}
