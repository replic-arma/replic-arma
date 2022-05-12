import type { IReplicArmaRepository, Repository } from '@/models/Repository';
import { invoke } from '@tauri-apps/api';
import { appDir } from '@tauri-apps/api/path';
import { compress, uncompress } from './compress';
import { ensureAppDir, fileExists, readBinaryFile, writeBinaryFile } from './fs';

const FILE_NAME = 'repos.json.gz';

export async function loadRepos(): Promise<Array<IReplicArmaRepository>> {
    const exists = await fileExists(FILE_NAME);
    if (!exists) return [];

    const data = await readBinaryFile(FILE_NAME);

    return JSON.parse(await uncompress(data));
}

export async function saveRepos(contents: Array<IReplicArmaRepository>): Promise<void> {
    await ensureAppDir();

    const data = await compress(JSON.stringify(contents));

    return writeBinaryFile(FILE_NAME, data);
}

export async function getRepoFromURL(url: string): Promise<Repository> {
    return invoke('get_repo', { url });
}
