import { File, Modset } from '@/models/Repository';

async function splitFiles (files: File[], modset: Modset): Promise<File[]> {
    const mods = modset.mods?.map(mod => { return mod.name; });
    if (mods === undefined) throw new Error('Modset has no files');
    return [...new Set(files?.filter(x => {
        if (mods?.find(modName => modName === x.path.split('\\')[0])) {
            return x;
        }
    }
    ))];
}

addEventListener('message', async (event: MessageEvent) => {
    const { files, modset } = event.data;
    const filePaths = await splitFiles(files, modset);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    postMessage(filePaths, this!);
});
