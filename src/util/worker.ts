import { File, Modset } from '@/models/Repository';
import { expose } from 'threads';
import pako from 'pako';
import { v4 as uuidv4 } from 'uuid';
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
            });
            modset.mods = mods;
        });
        return modsets;
    },
    async getFileChanges (wantedFiles: File[], checkedFiles: Array<Array<string>>): Promise<string[]> {
        const flat = checkedFiles.flat();
        return wantedFiles.filter((wantedFile) => !flat.includes(wantedFile.sha1) && wantedFile.sha1 !== "0").map(file => file.path);
    },
    async getFilesForModset (modset: Modset) {
        return modset?.mods !== undefined ? modset.mods?.flatMap(mod => mod.files) : [];
    },
    async getFileSize (mods: ModsetMod[], filesPaths: string[]) {
        return mods
            .flatMap(mod => mod.files ?? [])
            .filter(file => filesPaths.includes(file.path))
            .reduce((previousValue, currentValue) => previousValue + currentValue.size, 0);
    },
    async isFileIn (wantedFiles: File[], fileList: Array<string>): Promise<string[]> {
        return wantedFiles.filter((wantedFile) => fileList.includes(wantedFile.path)).map(file => file.path)
    },
    async compress (data: any) {
        return pako.deflate(data);
    },
    async uncompress (data: any) {
        return JSON.parse(pako.inflate(data, { to: 'string' }));
    }
};

export type ReplicWorker = typeof replicWorker;
expose(replicWorker);
