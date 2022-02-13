import { File, Modset } from '@/models/Repository';
import { expose } from 'threads';
const replicWorker = {
    splitFiles (files: File[], modset: Modset): File[] {
        if (modset.mods === undefined) throw new Error('Modset has no mods');
        const mods = modset.mods.map(mod => { return mod.name; });
        if (mods === undefined) throw new Error('Modset has no files');
        return [...new Set(files.filter(x => {
            if (mods.find(modName => modName === x.path.split('\\')[0])) {
                return x;
            }
        }
        ))];
    },
    getFileChanges (wantedFiles: File[], checkedFiles: Array<Array<string>>): string[] {
        const flat = checkedFiles.flat();
        return wantedFiles.filter((wantedFile) => !flat.includes(wantedFile.sha1)).map(file => file.path);
    },
    prependFilePath (files: File[], downloadDir: string, seperator: string): string[] {
        return files.map((file) => `${downloadDir}${seperator}${file.path}`);
    }
};

export type ReplicWorker = typeof replicWorker;
expose(replicWorker);
