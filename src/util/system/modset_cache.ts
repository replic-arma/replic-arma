import type { Modset } from '@/models/Repository';
import { compress, uncompress } from './compress';
import { ensureAppDir, fileExists, readBinaryFile, writeBinaryFile } from './fs';

type TContents = { [key: string]: Modset | undefined };

export async function loadModsetCache(repositoryID: string): Promise<TContents> {
    const fileName = `${repositoryID}.json`;

    const exists = await fileExists(fileName);
    if (!exists) return {};

    const data = await readBinaryFile(fileName);

    return JSON.parse(await uncompress(data));
}

export async function saveModsetCache(repositoryID: string, contents: TContents): Promise<void> {
    const fileName = `${repositoryID}.json`;

    await ensureAppDir();

    const data = await compress(JSON.stringify(contents));

    return writeBinaryFile(fileName, data);
}
