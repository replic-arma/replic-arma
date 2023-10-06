import type { File, Modset, ModsetMod } from '@/models/Repository';
import { useWebWorkerFn } from '@vueuse/core';
import type { HashResponseItem } from './system/hashes';

export const ReplicWorker = {
    async mapFilesToMods(files: File[], modsets: Modset[]): Promise<Modset[]> {
        const { workerFn } = useWebWorkerFn((files: File[], modsets: Modset[]) => {
            modsets.map(modset => {
                const modMap = new Map<string, File[]>();
                files.forEach(file => {
                    const modName = file.path.split('\\')[0];
                    if (modName === undefined) return;
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
                    mods.push({
                        name: mod.name,
                        mod_type: 'mod',
                        files: modMap.get(mod.name) ?? [],
                        size: (modMap.get(mod.name) ?? []).reduce(
                            (previousValue: number, currentValue: { size: number }) =>
                                previousValue + currentValue.size,
                            0
                        )
                    });
                });
                modset.mods = mods;
                return modset;
            });
            return modsets;
        });
        return workerFn(files, modsets);
    },
    async createModsetFromFiles(files: File[]): Promise<ModsetMod[]> {
        const { workerFn } = useWebWorkerFn((files: File[]) => {
            const modMap = new Map<string, File[]>();
            files.forEach(file => {
                const modName = file.path.split('\\')[0];
                if (modName === undefined) return;
                const foundMod = modMap.get(modName);
                if (foundMod !== undefined) {
                    foundMod.push(file);
                    modMap.set(modName, foundMod);
                } else {
                    modMap.set(modName, [file]);
                }
            });
            return Array.from(modMap.keys()).map(modName => {
                return {
                    name: modName,
                    mod_type: 'mod',
                    files: modMap.get(modName)
                };
            });
        });
        return workerFn(files);
    },
    async isFileIn(wantedFiles: File[], fileList: Array<HashResponseItem>): Promise<Array<HashResponseItem>> {
        const { workerFn } = useWebWorkerFn((wantedFiles: File[], fileList: Array<HashResponseItem>) => {
            const list = wantedFiles.map(file => file.path);
            return fileList.filter(wantedFile => list.indexOf(wantedFile.file) !== -1);
        });
        return workerFn(wantedFiles, fileList);
    }
};
