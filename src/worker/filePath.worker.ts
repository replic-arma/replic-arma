import { File } from '@/models/Repository';

async function preprendFilePath (files: File[], downloadDir: string, seperator: string): Promise<string[]> {
    return files.map((file) => `${downloadDir}${seperator}${file.path}`);
}

addEventListener('message', async (event: MessageEvent) => {
    const { files, downloadDir, seperator } = event.data;
    const filePaths = await preprendFilePath(files, downloadDir, seperator);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    postMessage(filePaths, this!);
});
