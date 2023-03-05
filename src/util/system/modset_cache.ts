import type { Modset } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { compress, uncompress } from './compress';
import {
    ensureAppDir,
    fileExists,
    readBinaryFile,
    readDir, readTextFile, removeFile,
    writeBinaryFile, writeTextFile
} from './fs';

export async function loadModsetCache(repositoryID: string): Promise<Array<Modset>> {
    const fileName = `${repositoryID}.cache.json`;

    const exists = await fileExists(fileName);
    if (!exists) return [];

    // const data = await readBinaryFile(fileName);
    const data = await readTextFile(fileName);

    // return JSON.parse(await uncompress(data));
    return JSON.parse(data);
}

export async function saveModsetCache(repositoryID: string, contents: Array<Modset>): Promise<void> {
    const fileName = `${repositoryID}.cache.json`;

    await ensureAppDir();

    // const data = await compress(JSON.stringify(contents));

    // return writeBinaryFile(fileName, data);
    return writeTextFile(fileName, JSON.stringify(contents));
}

export async function clearModsetCache(repoId: string | null = null) {
    useRepoStore().modsetCache = [];
    const fileName = repoId === null ? `.cache.json` : `${repoId}.cache.json`;

    await ensureAppDir();

    const files = await readDir('');
    files.forEach(file => {
        if (file.name?.includes(fileName)) {
            removeFile(file.path.split('\\').pop() ?? '');
        }
    });
}
