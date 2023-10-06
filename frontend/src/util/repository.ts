import { v4 as uuidv4 } from 'uuid';
import type { File, IReplicArmaRepository, Mod, Modset, ModsetMod, Repository } from '@/models/Repository';

export function patchRepository(repository: IReplicArmaRepository, repoData: Repository) {
    let mods: ModsetMod[] = [];
    repository.files = repoData.files;

    mods = createModsFromFiles(repoData.files);
    const allModsModset = repository.modsets.find(modset => modset.name === 'All Mods');
    repository.modsets = repoData.modsets.map((modset: Modset) => {
        const oldModset = repository.modsets.find(
            oldModset => oldModset.name === modset.name && oldModset.name !== 'All Mods'
        );
        return { ...modset, id: oldModset?.id ?? uuidv4() };
    });

    if (allModsModset !== undefined) {
        allModsModset.mods = mods;
        repository.modsets.unshift(allModsModset);
    } else {
        repository.modsets.unshift({
            id: uuidv4(),
            name: 'All Mods',
            description: 'Contains all Mods from the Repository',
            mods
        });
    }
    repository.build_date = repoData.build_date;
    repository.revision = repoData.revision;
    repository.name = repoData.name;
    return repository;
}

export function createModsFromFiles(files: File[]) {
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
        const files = modMap.get(modName) ?? [];
        const size = files?.reduce((pVal: number, cVal: { size: number }) => pVal + cVal.size, 0) ?? 0;
        return {
            name: modName,
            mod_type: 'mod',
            files,
            size
        };
    });
}
