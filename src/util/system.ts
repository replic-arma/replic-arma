import { invoke } from '@tauri-apps/api/tauri';
import { cacheDir, documentDir, sep } from '@tauri-apps/api/path';
import { createDir, BaseDirectory, writeFile, readTextFile, removeFile } from '@tauri-apps/api/fs';
import { ApplicationSettings } from '@/models/Settings';
import { File, GameServer, JSONMap, Modset, ReplicArmaRepository } from '@/models/Repository';
import { useSettingsStore } from '@/store/settings';
import { useRepoStore } from '@/store/repo';
import { Command } from '@tauri-apps/api/shell';
import { listen } from '@tauri-apps/api/event';
import { useHashStore } from '@/store/hash';
import { toRaw } from 'vue';
export class System {
    private static APPDIR = 'Replic-Arma';
    private static DOCUMENTDIRECTORY = documentDir();
    private static CACHEDIRECTORY = cacheDir();
    public static SEPERATOR = sep;

    public static init (): void {
        console.info('Starting Init');
        const settingsStore = useSettingsStore();
        const repoStore = useRepoStore();
        const hashStore = useHashStore();
        Promise.all([settingsStore.loadData(), repoStore.loadRepositories(), hashStore.loadData()]).then(
            async () => {
                console.info('Init finished');
                System.revisionCheck();
            }
        );
        System.registerListener();
    }

    public static async getConfig (): Promise<ApplicationSettings> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;
        const exists = await System.fileExists(documentDirectory + System.APPDIR + sep + 'config.json');

        if (!exists) return new ApplicationSettings();
        return JSON.parse(await readTextFile(System.APPDIR + sep + 'config.json', { dir: BaseDirectory.Document }));
    }

    public static async updateConfig (content: ApplicationSettings): Promise<void> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;

        await System.dirExists(documentDirectory + System.APPDIR).then(exists => {
            if (exists) return;

            return createDir(System.APPDIR, { dir: BaseDirectory.Document });
        });
        return writeFile({ contents: JSON.stringify(content, null, '\t'), path: documentDirectory + System.APPDIR + sep + 'config.json' }, { dir: BaseDirectory.Document });
    }

    public static async getRepoJson (): Promise<Map<string, ReplicArmaRepository>|null> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;
        const exists = await System.fileExists(documentDirectory + System.APPDIR + sep + 'repos.json');

        if (!exists) return null;

        return JSON.parse(await readTextFile(System.APPDIR + sep + 'repos.json', { dir: BaseDirectory.Document }));
    }

    public static async updateRepoJson (content: JSONMap<string, ReplicArmaRepository> | Record<string, never>): Promise<void> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;

        await System.dirExists(documentDirectory + System.APPDIR).then(exists => {
            if (exists) return;

            return createDir(System.APPDIR, { dir: BaseDirectory.Document });
        });

        return writeFile({ contents: JSON.stringify(content, null), path: System.SEPERATOR + System.APPDIR + System.SEPERATOR + 'repos.json' }, { dir: BaseDirectory.Document });
    }

    public static async getCache (): Promise<JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>> {
        const documentDirectory = await System.DOCUMENTDIRECTORY;
        const exists = await System.fileExists(documentDirectory + System.APPDIR + sep + 'cache.json');

        if (!exists) return new JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>();

        return JSON.parse(await readTextFile(System.APPDIR + sep + 'cache.json', { dir: BaseDirectory.Document }));
    }

    public static async updateCache (content: JSONMap<string, {checkedFiles: string[][], outdatedFiles: string[], missingFiles: string[]}>): Promise<void> {
        console.info('Updating cache');
        const documentDirectory = await System.DOCUMENTDIRECTORY;

        await System.dirExists(documentDirectory + System.APPDIR).then(exists => {
            if (exists) return;

            return createDir(System.APPDIR, { dir: BaseDirectory.Document });
        });
        return writeFile({ contents: JSON.stringify(content), path: System.APPDIR + sep + 'cache.json' });
    }

    public static async clearCache (): Promise<void> {
        const cacheDirectory = await System.CACHEDIRECTORY;
        let exists = await System.fileExists(cacheDirectory + System.APPDIR + sep + 'data' + sep + 'hashes.json');
        if (!exists) return;
        await removeFile(cacheDirectory + System.APPDIR + sep + 'data' + sep + 'hashes.json');
        const documentDirectory = await System.DOCUMENTDIRECTORY;
        exists = await System.fileExists(System.APPDIR + sep + 'cache.json');
        if (!exists) return;
        await removeFile(System.APPDIR + sep + 'cache.json');
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
        const hashStore = useHashStore();
        const repo = toRaw(repoStore.getRepo(repoId));
        if (repo === undefined) throw new Error(`Repository with id ${repoId} not found`);
        if (repo.files === undefined) throw new Error(`Repository with id ${repoId} has no files`);
        const modset = toRaw(repoStore.getModset(repoId, modsetId));
        if (modset === undefined) throw new Error(`Modset with id ${modsetId} not found`);
        const modsetFiles = await (await hashStore.getWorker).splitFiles(repo.files, modset);
        return modsetFiles;
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
        const hashStore = useHashStore();
        await listen('hash_calculated', () => {
            if (hashStore.current === null) throw new Error('Current hash object empty');
            hashStore.current.checkedFiles += 1;
        });
        // await listen('hash_failed', (event: any) => {
        //     repoStore.filesFailed.push(event.payload);
        // });
    }

    public static async revisionCheck (force = false): Promise<void> {
        console.info('Starting Revision check');
        const repoStore = useRepoStore();
        const hashStore = useHashStore();
        repoStore.getRepos.forEach(async repo => {
            repo.status = 'checking';
            repo.save();
            if (force) {
                repo.calcHash();
                return;
            }
            if (hashStore.cache.get(repo.id) === undefined) {
                console.info(`Repository ${repo.name} is not cached yet`);
                repo.status = 'outdated';
                repo.save();
                repo.calcHash();
            } else {
                const externalRepo = await System.getRepo(`${repo.config_url}autoconfig`);
                if (externalRepo.revision !== repo.revision) {
                    console.info(`Detected new Revision for Repository ${repo.name}`);
                    repo.revisionChanged = true;
                    repo.revision = externalRepo.revision;
                    repo.status = 'outdated';
                    repo.save();
                    repo.calcHash();
                } else {
                    console.info(`Repository ${repo.name} ready`);
                    repo.revisionChanged = false;
                    repo.status = 'ready';
                    repo.save();
                }
            }
        });
    }

    public static async downloadFiles (repoId: string|null, modsetId: string|null, outdatedFiles: string[], missingFiles: string[]): Promise<void> {
        const repoStore = useRepoStore();
        const settingsStore = useSettingsStore();
        const repo = repoStore.getRepo(repoId);
        if (repo === undefined) throw new Error(`Repository with id ${repoId} not found`);
        return await invoke('download', { repoType: repo.type?.toUpperCase(), url: repo.download_server?.url, targetPath: settingsStore.settings.downloadDirectoryPath, fileArray: [...missingFiles.map(path => path.replace(`${settingsStore.settings.downloadDirectoryPath}${System.SEPERATOR}` ?? '', '')), ...outdatedFiles] });
    }
}
