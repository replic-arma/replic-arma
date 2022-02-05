import { invoke } from '@tauri-apps/api/tauri';
import { documentDir, sep } from '@tauri-apps/api/path';
import { createDir, BaseDirectory, writeFile, readTextFile } from '@tauri-apps/api/fs';
import { ApplicationSettings } from '@/models/Settings';
import { File, GameServer, ReplicArmaRepository } from '@/models/Repository';
import { useSettingsStore } from '@/store/settings';
import { useRepoStore } from '@/store/repo';
import { Command } from '@tauri-apps/api/shell';
import { listen } from '@tauri-apps/api/event';
export class System {
    private static APPDIR = 'Replic-Arma';
    private static DOCUMENTDIRECTORY = documentDir();

    public static init (): void {
        // init application settings store
        const settingsStore = useSettingsStore();
        settingsStore.loadData();

        // init repository store
        const repoStore = useRepoStore();
        repoStore.loadRepositories();
    }

    public static async getConfig (): Promise<ApplicationSettings> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;
        const exists = await System.fileExists(documentDirectory + sep + System.APPDIR + sep + 'config.json');

        if (!exists) return new ApplicationSettings();

        return JSON.parse(await readTextFile(documentDirectory + sep + System.APPDIR + sep + 'config.json'));
    }

    public static async updateConfig (content: ApplicationSettings): Promise<void> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;

        await System.dirExists(documentDirectory + System.APPDIR).then(exists => {
            if (exists) return;

            return createDir(System.APPDIR, { dir: BaseDirectory.Document });
        });
        return writeFile({ contents: JSON.stringify(content, null, '\t'), path: documentDirectory + sep + System.APPDIR + sep + 'config.json' });
    }

    public static async getRepoJson (): Promise<Map<string, ReplicArmaRepository>|null> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;
        const exists = await System.fileExists(documentDirectory + sep + System.APPDIR + sep + 'repos.json');

        if (!exists) return null;

        return JSON.parse(await readTextFile(documentDirectory + sep + System.APPDIR + sep + 'repos.json'));
    }

    public static async updateRepoJson (content: any | Record<string, never>): Promise<void> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;

        await System.dirExists(documentDirectory + System.APPDIR).then(exists => {
            if (exists) return;

            return createDir(System.APPDIR, { dir: BaseDirectory.Document });
        });
        return writeFile({ contents: JSON.stringify(content, null, '\t'), path: documentDirectory + sep + System.APPDIR + sep + 'repos.json' });
    }

    public clearCache () {
        // TODO
    }

    public static calcModsetStatus (repoId: string|null, modsetId: string|null): void {
        const repoStore = useRepoStore();
        const files = System.getFilesForModset(repoId, modsetId);
        const filePaths = System.getFilePathsForModset(repoId, modsetId);
        System.registerListener();
        repoStore.filesToCheck = filePaths;
        System.hashCheck(filePaths).then((hashes: Array<Array<Array<string>>>) => {
            // console.log(hashes);
            // console.log(repoStore.filesChecked);
            console.log('Files needed', filePaths.length);
            console.log('Files missing', repoStore.filesFailed.length);
            console.log('Files Outdated', System.getFileChanges(files, hashes[0]).length);
        });
    }

    private static getFileChanges (wantedFiles: File[], checkedFiles: Array<Array<string>>) {
        const notMatchingHash: string[] = [];
        wantedFiles.map(wantedFile => {
            const checkedFile = checkedFiles.find((file: any) => file[0] === System.prependDirectoryToPath(wantedFile.path));
            if (checkedFile && checkedFile[1] !== wantedFile.sha1) {
                notMatchingHash.push(checkedFile[0]);
            }
        });
        return notMatchingHash;
    }

    public static async launchGame (repoId: string, modsetId: string, gameServer: GameServer|null = null): Promise<void> {
        const settingsStore = useSettingsStore();
        if (settingsStore.settings.gamePath === null) throw Error('Game Executable not set, cannot launch the game');
        if (settingsStore.settings.downloadDirectoryPath === null) throw Error('Mod Directoy not set, cannot launch the game');
        const launchOptions = System.getModString(repoId, modsetId) + System.getConnectionString(gameServer);
        const command = new Command(settingsStore.settings.gamePath, launchOptions);
        command.on('close', data => {
            console.log(`command finished with code ${data.code} and signal ${data.signal}`);
        });
        command.on('error', error => console.error(`command error: "${error}"`));
        command.stdout.on('data', line => console.log(`command stdout: "${line}"`));
        command.stderr.on('data', line => console.log(`command stderr: "${line}"`));

        const child = await command.spawn();
        console.log('pid:', child.pid);
    }

    private static getModString (repoId: string, modsetId: string) {
        const settingsStore = useSettingsStore();
        const repoStore = useRepoStore();
        const modset = repoStore.getModset(repoId, modsetId);
        if (modset === undefined) throw Error(`Modset with name ${modsetId} not found`);
        return '-mod=' + modset?.mods?.map(mod => { return settingsStore.settings.downloadDirectoryPath + sep + mod.name; }).join(';') + ';';
    }

    private static getConnectionString (gameServer: GameServer|null = null) {
        if (gameServer === null) return '';
        return '-ip=' + gameServer.host + ';' + '-port=' + gameServer.port + ';' + '-password=' + gameServer.password + ';';
    }

    public static getFilesForModset (repoId: string|null, modsetId: string|null): File[] {
        const repoStore = useRepoStore();
        const repo = repoStore.getRepo(repoId);
        if (repo === undefined) throw Error(`Repository with id ${repoId} not found`);
        const modset = repoStore.getModset(repoId, modsetId);
        if (modset === undefined) throw Error(`Modset with id ${modsetId} not found`);
        const mods = modset.mods?.map(mod => { return mod.name; });
        return [...new Set(repo.files?.map(x => {
            if (mods?.find(modName => modName === x.path.split('\\')[0])) {
                return x;
            } else {
                throw Error('Mod not found');
            }
        }
        ))];
    }

    public static getFilePathsForModset (repoId: string|null, modsetId: string|null): string[] {
        const files = System.getFilesForModset(repoId, modsetId);
        return files.map(file => System.prependDirectoryToPath(file.path));
    }

    private static prependDirectoryToPath (path: string) {
        const settingsStore = useSettingsStore();
        return settingsStore.settings.downloadDirectoryPath + sep + path;
    }

    public static resetSettings (): void {
        System.updateConfig(new ApplicationSettings());
    }

    public static async getRepo (url: string): Promise<ReplicArmaRepository> {
        return await invoke('get_repo', { url: url });
    }

    public static async fileExists (path: string): Promise<boolean> {
        return await invoke('file_exists', { path: path });
    }

    public static async dirExists (path: string): Promise<boolean> {
        return await invoke('dir_exists', { path: path });
    }

    public static async hashCheck (files: string[]): Promise<Array<Array<Array<string>>>> {
        return await invoke('hash_check', { files: files });
    }

    public static async registerListener () {
        await listen('hash_calculated', (event: any) => {
            const repoStore = useRepoStore();
            repoStore.filesChecked.push(event.payload);
        });
        await listen('hash_failed', (event: any) => {
            const repoStore = useRepoStore();
            repoStore.filesFailed.push(event.payload);
        });
    }
}
