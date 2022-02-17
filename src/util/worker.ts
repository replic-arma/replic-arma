import { File, Modset } from '@/models/Repository';
import { expose } from 'threads';
export class ModsetMod {
    public mod_type!: string;
    public name!: string;
    public allow_compat?: boolean;
    public files?: File[];
    public outdatedFiles?: [];
    public missingFiles?: [];

    constructor (name: string, mod_type: string, files: File[] = [], allow_compat = false) {
        this.name = name;
        this.mod_type = mod_type;
        this.files = files;
        this.allow_compat = allow_compat;
    }
}

const replicWorker = {
    async splitFiles (files: File[], mod: ModsetMod): Promise<File[]> {
        return [...new Set(files.filter(file => {
            if (mod.name === file.path.split('\\')[0]) {
                return file;
            }
        }
        ))];
    },
    async mapFilesToMods (files: File[], modsets: Modset[]): Promise<Modset[]> {
        modsets.map(modset => {
            const modMap = new Map<string, File[]>();
            files.forEach(file => {
                const modName = file.path.split('\\')[0];
                const foundMod = modMap.get(modName);
                if (foundMod !== undefined) {
                    foundMod.push(file);
                    modMap.set(modName, foundMod);
                } else {
                    modMap.set(modName, [file]);
                }
            });
            const mods: ModsetMod[] = [];
            modset.mods?.forEach(mod => {
                mods.push({name: mod.name, mod_type: 'mod', files: modMap.get(mod.name) ?? []});
            })
            modset.mods = mods;
        })
        return modsets;
    },
    async getFileChanges (wantedFiles: File[], checkedFiles: Array<Array<string>>): Promise<string[]> {
        const flat = checkedFiles.flat();
        return wantedFiles.filter((wantedFile) => !flat.includes(wantedFile.sha1)).map(file => file.path);
    },
    async prependFilePath (files: File[], downloadDir: string, seperator: string): Promise<string[]> {
        return files.map((file) => `${downloadDir}${seperator}${file.path}`);
    }
};

export type ReplicWorker = typeof replicWorker;
expose(replicWorker);
