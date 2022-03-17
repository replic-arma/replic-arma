import type { IReplicArmaRepository } from '@/models/Repository';
import { compress, uncompress } from './compress';
import { ensureAppDir, fileExists, readBinaryFile, writeBinaryFile } from './fs';

const FILE_NAME = 'repos.json.gz';

type TContents = { [key: string]: IReplicArmaRepository | undefined };

export async function loadFromJSON(): Promise<TContents> {
    const exists = await fileExists(FILE_NAME);
    if (!exists) return {};

    const data = await readBinaryFile(FILE_NAME);

    return JSON.parse(await uncompress(data));
}

export async function saveToJSON(contents: TContents): Promise<void> {
    await ensureAppDir();

    const data = await compress(JSON.stringify(contents));

    return writeBinaryFile(FILE_NAME, data);
}
