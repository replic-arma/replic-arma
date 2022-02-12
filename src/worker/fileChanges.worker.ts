import { File } from '@/models/Repository';

async function getFileChanges (wantedFiles: File[], checkedFiles: Array<Array<string>>): Promise<string[]> {
    const flat = checkedFiles.flat();
    return wantedFiles.filter((wantedFile) => !flat.includes(wantedFile.sha1)).map(file => file.path);
}

addEventListener('message', async (event: MessageEvent) => {
    const { wantedFiles, checkedFiles } = event.data;
    const changes = await getFileChanges(wantedFiles, checkedFiles);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    postMessage(changes, this!);
});
