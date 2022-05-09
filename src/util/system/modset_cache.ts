import type { Modset } from '@/models/Repository';
import { compress, uncompress } from './compress';
import { ensureAppDir, fileExists, readBinaryFile, readDir, removeFile, writeBinaryFile } from './fs';

export async function loadModsetCache(repositoryID: string): Promise<Array<Modset>> {
    const fileName = `${repositoryID}.cache.json`;

    const exists = await fileExists(fileName);
    if (!exists) return [];

    const data = await readBinaryFile(fileName);

    return JSON.parse(await uncompress(data));
}

export async function saveModsetCache(repositoryID: string, contents: Array<Modset>): Promise<void> {
    const fileName = `${repositoryID}.cache.json`;

    await ensureAppDir();

    const data = await compress(JSON.stringify(contents));

    return writeBinaryFile(fileName, data);
}

export async function clearModsetCache() {
    const fileName = `.cache.json`;

    await ensureAppDir();

    const files = await readDir('');
    files.forEach((file) => {
        if (file.name?.includes(fileName)) {
            removeFile(file.path.split('\\').pop() ?? '');
        }
    });
}
