import { invoke } from '@tauri-apps/api/tauri';
import { cacheDir, documentDir, sep } from '@tauri-apps/api/path';
import { createDir, BaseDirectory, writeFile, readTextFile, removeFile } from '@tauri-apps/api/fs';
import { ApplicationSettings } from '@/models/Settings';
import { File, GameServer, JSONMap, ReplicArmaRepository } from '@/models/Repository';
import { useSettingsStore } from '@/store/settings';
import { useRepoStore } from '@/store/repo';
import { Command } from '@tauri-apps/api/shell';
import { listen } from '@tauri-apps/api/event';
import { useHashStore } from '@/store/hash';
import { getFileChanges, getFilePathsForModset, splitFiles } from './worker';
export class System {
    private static APPDIR = 'Replic-Arma';
    private static DOCUMENTDIRECTORY = documentDir();
    private static CACHEDIRECTORY = cacheDir();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private static hashCheckeeee = () => {};

    public static init (): void {
        const settingsStore = useSettingsStore();
        const repoStore = useRepoStore();
        const hashStore = useHashStore();
        Promise.all([settingsStore.loadData(), repoStore.loadRepositories()]).then(() => System.revisionCheck());
        System.registerListener();

        System.hashCheckeeee = hashStore.$subscribe((mutation, state) => {
            if (state.current === null) {
                hashStore.next();
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                System.hashCheckeeee = () => {};
            }
        });
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

    public static async updateRepoJson (content: JSONMap<string, ReplicArmaRepository> | Record<string, never>): Promise<void> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;

        await System.dirExists(documentDirectory + System.APPDIR).then(exists => {
            if (exists) return;

            return createDir(System.APPDIR, { dir: BaseDirectory.Document });
        });
        return writeFile({ contents: JSON.stringify(content, null, '\t'), path: documentDirectory + sep + System.APPDIR + sep + 'repos.json' });
    }

    public static async clearCache (): Promise<void> {
        const cacheDirectory = await System.CACHEDIRECTORY;
        const exists = await System.fileExists(cacheDirectory + System.APPDIR + sep + 'data' + sep + 'hashes.json');
        if (!exists) return;
        await removeFile(cacheDirectory + System.APPDIR + sep + 'data' + sep + 'hashes.json');
    }

    public static async calcModsetStatus (repoId: string|null, modsetId: string|null): Promise<void> {
        const hashStore = useHashStore();
        const repoStore = useRepoStore();
        const settingsStore = useSettingsStore();
        if (repoId === undefined || repoId === null) throw new Error(`Repository with id ${repoId} not found`);
        if (modsetId === undefined || modsetId === null) throw new Error(`Modset with id ${modsetId} not found`);
        if (hashStore.current === null) throw new Error('Current hash object empty');
        const files = await System.getFilesForModset(repoId, modsetId);
        const filePaths = await getFilePathsForModset(files, settingsStore.settings.downloadDirectoryPath ?? '', sep);
        hashStore.current.filesToCheck = files.length;
        repoStore.filesToCheck = filePaths;
        System.hashCheck(filePaths).then(async (hashes: Array<Array<Array<string>>>) => {
            const outDatedFiles = await getFileChanges(files, hashes[0], settingsStore.settings.downloadDirectoryPath ?? '', sep);
            const modset = repoStore.getModset(repoId, modsetId);
            if (modset === undefined) throw new Error(`Modset with id ${modsetId} not found`);
            if (hashes[1].length > 0 || outDatedFiles.length > 0) {
                modset.status = 'outdated';
            } else {
                modset.status = 'ready';
            }
            const repo = repoStore.repos.get(repoId);
            if (repo === undefined) throw new Error(`Repository with id ${repoId} not found`);
            repo.outdatedFiles = outDatedFiles;
            repo.missingFiles = hashes[1] as unknown as string[];
            repo?.modsets?.set(modsetId, modset);
            repoStore.repos.set(repoId, repo);
            await hashStore.next();
        });
    }

    public static async launchGame (repoId: string, modsetId: string, gameServer: GameServer|null = null): Promise<void> {
        const settingsStore = useSettingsStore();
        if (settingsStore.settings.gamePath === null) throw new Error('Game Executable not set, cannot launch the game');
        if (settingsStore.settings.downloadDirectoryPath === null) throw new Error('Mod Directoy not set, cannot launch the game');
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
        if (modset === undefined) throw new Error(`Modset with name ${modsetId} not found`);
        return `-mod=${modset?.mods?.map(mod => { return settingsStore.settings.downloadDirectoryPath + sep + mod.name; }).join(';')};`;
    }

    private static getConnectionString (gameServer: GameServer|null = null) {
        if (gameServer === null) return '';
        return `-ip=${gameServer.host};-port=${gameServer.port};-password=${gameServer.password};`;
    }

    public static async getFilesForModset (repoId: string|null, modsetId: string|null): Promise<File[]> {
        const repoStore = useRepoStore();
        const repo = repoStore.getRepo(repoId);
        if (repo === undefined) throw new Error(`Repository with id ${repoId} not found`);
        if (repo.files === undefined) throw new Error(`Repository with id ${repoId} has no files`);
        const modset = repoStore.getModset(repoId, modsetId);
        if (modset === undefined) throw new Error(`Modset with id ${modsetId} not found`);
        const mods = modset.mods?.map(mod => { return mod.name; });
        if (mods === undefined) throw new Error(`Modset with id ${modsetId} has no files`);
        return await splitFiles(repo.files, mods);
    }

    public static resetSettings (): void {
        System.updateConfig(new ApplicationSettings());
    }

    public static async getRepo (url: string|undefined): Promise<ReplicArmaRepository> {
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

    public static async registerListener (): Promise<void> {
        const repoStore = useRepoStore();
        const hashStore = useHashStore();
        await listen('hash_calculated', (event: any) => {
            repoStore.filesChecked.push(event.payload);
            if (hashStore.current === null) throw new Error('Current hash object empty');
            hashStore.current.checkedFiles += 1;
        });
        await listen('hash_failed', (event: any) => {
            repoStore.filesFailed.push(event.payload);
        });
    }

    private static async revisionCheck () {
        const repoStore = useRepoStore();
        const hashStore = useHashStore();
        repoStore.getRepos.forEach(async repo => {
            const externalRepo = await System.getRepo(`${repo.config_url}autoconfig`);
            if (externalRepo.revision !== repo.revision) {
                repo.revisionChanged = true;
                repoStore.repos.set(repo.id, repo);
                repo.modsets?.forEach(modset => hashStore.startHash(repo.id, modset.id));
            }
        });
    }
}
