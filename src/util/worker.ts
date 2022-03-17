import type { File, Modset, ModsetMod } from '@/models/Repository';
import { useWebWorkerFn } from '@vueuse/core';
import { System } from '@/util/system';
import DeflateWorker from './deflate_worker?worker';
import UncompressWorker from './uncompress_worker?worker';

export const ReplicWorker = {
    async mapFilesToMods(files: File[], modsets: Modset[]): Promise<Modset[]> {
        const { workerFn } = useWebWorkerFn((files: File[], modsets: Modset[]) => {
            modsets.map((modset) => {
                const modMap = new Map<string, File[]>();
                files.forEach((file) => {
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
                modset.mods?.forEach((mod) => {
                    mods.push({
                        name: mod.name,
                        mod_type: 'mod',
                        files: modMap.get(mod.name) ?? [],
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
            files.forEach((file) => {
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
            return Array.from(modMap.keys()).map((modName) => {
                return {
                    name: modName,
                    mod_type: 'mod',
                    files: [],
                };
            });
        });
        return workerFn(files);
    },
    async createModsetFromModset(modsets: Modset[]): Promise<ModsetMod[]> {
        const { workerFn } = useWebWorkerFn((modsets: Modset[]) => {
            return (
                [
                    ...new Map(
                        modsets
                            .map((modset) => modset.mods)
                            .flat()
                            .map((mod) => [mod.name, mod])
                    ).values(),
                ] ?? []
            );
        });
        return workerFn(modsets);
    },
    async splitFiles(files: File[], mod: ModsetMod): Promise<File[]> {
        const { workerFn } = useWebWorkerFn((files: File[], mod: ModsetMod) => {
            return [...new Set(files.filter((file) => mod.name === file.path.split('\\')[0]))];
        });
        return workerFn(files, mod);
    },
    async getFileChanges(wantedFiles: File[], checkedFiles: Array<Array<string>>): Promise<string[]> {
        const { workerFn } = useWebWorkerFn((wantedFiles: File[], checkedFiles: Array<Array<string>>) => {
            const flat = checkedFiles.flat();
            return wantedFiles
                .filter((wantedFile) => !flat.includes(wantedFile.sha1) && wantedFile.sha1 !== '0')
                .map((file) => file.path);
        });
        return workerFn(wantedFiles, checkedFiles);
    },
    async getFilesForModset(modset: Modset) {
        const { workerFn } = useWebWorkerFn((modset: Modset) => {
            return modset?.mods !== undefined ? modset.mods?.flatMap((mod: ModsetMod) => mod.files) : [];
        });
        return workerFn(modset);
    },
    async getFileSize(mods: ModsetMod[], filesPaths: string[]) {
        const { workerFn } = useWebWorkerFn((mods: ModsetMod[], filesPaths: string[]) => {
            return mods
                .flatMap((mod: ModsetMod) => mod.files ?? [])
                .filter((file: File) => filesPaths.indexOf(file.path) !== -1)
                .reduce(
                    (previousValue: number, currentValue: { size: number }) => previousValue + currentValue.size,
                    0
                );
        });
        return workerFn(mods, filesPaths);
    },
    async isFileIn(wantedFiles: File[], fileList: Array<string>): Promise<string[]> {
        const { workerFn } = useWebWorkerFn((wantedFiles: File[], fileList: Array<string>) => {
            return wantedFiles
                .filter((wantedFile) => fileList.indexOf(wantedFile.path) !== -1)
                .map((file) => file.path);
        });
        return workerFn(wantedFiles, fileList);
    },
    async compress(data: string) {
        const worker = new DeflateWorker();

        const promise = new Promise<Uint8Array>((resolve) => {
            worker.addEventListener(
                'message',
                (e) => {
                    resolve(e.data);
                },
                { once: true }
            );
        });

        worker.postMessage(data);
        return promise;
    },
    async uncompress<T>(data: Uint8Array): Promise<T> {
        const worker = new UncompressWorker();

        const promise = new Promise<T>((resolve) => {
            worker.addEventListener(
                'message',
                (e) => {
                    resolve(e.data);
                },
                { once: true }
            );
        });

        worker.postMessage(data);
        return promise;
    },
};
