import { File } from '@/models/Repository';

async function getFilePathsForModset (files: File[], downloadDir: string, seperator: string): Promise<string[]> {
    return files.map((file) => prependDirectoryToPath(downloadDir, file.path, seperator));
}

async function getFileChanges (wantedFiles: File[], checkedFiles: Array<Array<string>>, downloadDir: string, seperator: string): Promise<string[]> {
    const notMatchingHash: string[] = [];
    wantedFiles.map(wantedFile => {
        const checkedFile = checkedFiles.find((file: any, index: number) => {
            if (file[0] === prependDirectoryToPath(downloadDir, wantedFile.path, seperator)) {
                checkedFiles.splice(index, 1);
                return file;
            }
        });
        if (checkedFile && checkedFile[1] !== wantedFile.sha1) {
            notMatchingHash.push(checkedFile[0]);
        }
    });
    return notMatchingHash;
}

async function splitFiles (files: File[], mods: string[]): Promise<File[]> {
    return [...new Set(files?.filter(x => {
        if (mods?.find(modName => modName === x.path.split('\\')[0])) {
            return x;
        }
    }
    ))];
}
function prependDirectoryToPath (dir: string, path: string, seperator: string): string {
    return `${dir}${seperator}${path}`;
}

export { getFilePathsForModset, getFileChanges, splitFiles };
