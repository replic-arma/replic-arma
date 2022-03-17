import { invoke } from '@tauri-apps/api/tauri';
import { appDir, sep } from '@tauri-apps/api/path';
import {
    createDir,
    BaseDirectory,
    writeFile,
    readTextFile,
    removeFile,
    readBinaryFile,
    writeBinaryFile,
} from '@tauri-apps/api/fs';
import { ApplicationSettings } from '@/models/Settings';
import {
    type File,
    type GameServer,
    JSONMap,
    type Modset,
    type Repository,
    type IReplicArmaRepository,
} from '@/models/Repository';
import { useSettingsStore } from '@/store/settings';
import { useRepoStore } from '@/store/repo';
import { Command } from '@tauri-apps/api/shell';
import { listen } from '@tauri-apps/api/event';
import { useHashStore } from '@/store/hash';
import { toRaw } from 'vue';
import { useDownloadStore } from '@/store/download';
import { ReplicWorker } from './worker';
export class System {
    private static APPDIR = appDir();
    private static CONFIGPATH = `config.json`;
    private static REPOPATH = `repos.json`;
    public static SEPERATOR = sep;

    public static init(): void {
        const settingsStore = useSettingsStore();
        const repoStore = useRepoStore();
        System.APPDIR.then((asd) => console.log(asd));
        Promise.all([settingsStore.loadData(), repoStore.loadRepositories(true)]);
        System.registerListener();
    }

    public static async getConfig(): Promise<ApplicationSettings> {
        const exists = await System.fileExists(`${await System.APPDIR}${System.CONFIGPATH}`);
        if (!exists) return new ApplicationSettings();

        return JSON.parse(await readTextFile(`${await System.APPDIR}${System.CONFIGPATH}`, { dir: BaseDirectory.App }));
    }

    public static async updateConfig(content: ApplicationSettings): Promise<void> {
        const exists = await System.dirExists(await System.APPDIR);
        if (!exists) await createDir(await System.APPDIR, { dir: BaseDirectory.App });

        return writeFile({ contents: JSON.stringify(content), path: System.CONFIGPATH }, { dir: BaseDirectory.App });
    }

    public static async getRepoJson(): Promise<Map<string, IReplicArmaRepository> | null> {
        const exists = await System.fileExists(`${await System.APPDIR}${System.REPOPATH}`);
        if (!exists) return null;

        const data = await readBinaryFile(`${await System.APPDIR}${System.REPOPATH}`, { dir: BaseDirectory.App });
        return await ReplicWorker.uncompress<JSONMap<string, IReplicArmaRepository>>(data);
    }

    public static async updateRepoJson(
        content: JSONMap<string, IReplicArmaRepository> | Record<string, never>
    ): Promise<void> {
        const exists = await System.dirExists(await System.APPDIR);
        if (!exists) createDir(await System.APPDIR, { dir: BaseDirectory.App });

        const data = await ReplicWorker.compress(JSON.stringify(content));
        return writeBinaryFile(
            { contents: data, path: `${await System.APPDIR}${System.REPOPATH}` },
            { dir: BaseDirectory.App }
        );
    }

    public static async getModsetCache(repositoryId: string): Promise<JSONMap<string, Modset>> {
        const exists = await System.fileExists(`${await System.APPDIR}${sep}${repositoryId}.json`);
        if (!exists) return new JSONMap<string, Modset>();

        const data = await readBinaryFile(`${await System.APPDIR}${sep}${repositoryId}.json`, {
            dir: BaseDirectory.App,
        });
        return await ReplicWorker.uncompress(data);
    }

    public static async updateModsetCache(repositoryId: string, content: JSONMap<string, Modset>): Promise<void> {
        const exists = await System.dirExists(await System.APPDIR);
        if (!exists) createDir(await System.APPDIR, { dir: BaseDirectory.App });

        const data = await ReplicWorker.compress(JSON.stringify(content));
        return writeBinaryFile(
            { contents: data, path: `${await System.APPDIR}${sep}${repositoryId}.json` },
            { dir: BaseDirectory.App }
        );
    }

    public static async clearCache(): Promise<void> {
        const exists = await System.fileExists(`${await System.APPDIR}${sep}hashes.json`);
        if (!exists) return;
        await removeFile(`${await System.APPDIR}${sep}hashes.json`, { dir: BaseDirectory.App });
    }

    public static async launchGame(
        repoId: string,
        modsetId: string,
        gameServer: GameServer | null = null
    ): Promise<void> {
        const settingsStore = useSettingsStore();
        if (settingsStore.settings.gamePath === null)
            throw new Error('Game Executable not set, cannot launch the game');
        if (settingsStore.settings.downloadDirectoryPath === null)
            throw new Error('Mod Directoy not set, cannot launch the game');
        const launchOptions = System.getModString(repoId, modsetId) + System.getConnectionString(gameServer);
        const command = new Command(settingsStore.settings.gamePath, launchOptions);
        command.on('close', (data) => {
            console.log(`command finished with code ${data.code} and signal ${data.signal}`);
        });
        command.on('error', (error) => console.error(`command error: "${error}"`));
        command.stdout.on('data', (line) => console.log(`command stdout: "${line}"`));
        command.stderr.on('data', (line) => console.log(`command stderr: "${line}"`));

        const child = await command.spawn();
        console.log('pid:', child.pid);
    }

    private static getModString(repoId: string, modsetId: string) {
        const settingsStore = useSettingsStore();
        const repoStore = useRepoStore();
        const modset = repoStore.getModset(repoId, modsetId);
        if (modset === undefined) throw new Error(`Modset with name ${modsetId} not found`);
        return `-mod=${modset?.mods
            ?.map((mod) => {
                return settingsStore.settings.downloadDirectoryPath + sep + mod.name;
            })
            .join(';')};`;
    }

    private static getConnectionString(gameServer: GameServer | null = null) {
        if (gameServer === null) return '';
        return `-ip=${gameServer.host};-port=${gameServer.port};-password=${gameServer.password};`;
    }

    public static resetSettings(): void {
        System.updateConfig(new ApplicationSettings());
    }

    public static async getRepo(url: string | undefined): Promise<Repository> {
        return await invoke('get_repo', { url });
    }

    public static async fileExists(path: string): Promise<boolean> {
        return await invoke('file_exists', { path });
    }

    public static async dirExists(path: string): Promise<boolean> {
        return await invoke('dir_exists', { path });
    }

    public static async hashCheck(path: string, files: File[]): Promise<Array<Array<Array<string>>>> {
        return await invoke('hash_check', { pathPrefix: path, files: files.map((file) => file.path) });
    }

    public static async pauseDownload(): Promise<void> {
        return await invoke('pause_download');
    }

    public static async registerListener(): Promise<void> {
        const hashStore = useHashStore();
        const downloadStore = useDownloadStore();
        await listen('hash_calculated', () => {
            if (hashStore.current === null) throw new Error('Current hash object empty');
            hashStore.current.checkedFiles += 1;
        });
        await listen('download_report', (data: { payload: number }) => {
            if (downloadStore.current !== null) {
                downloadStore.current.received += data.payload;
                downloadStore.speeds.push(data.payload);
            }
        });
        await listen('download_finished', (data: { payload: string }) => {
            if (downloadStore.current !== null) {
                const cacheData = hashStore.cache.get(downloadStore.current.item.id);
                if (cacheData !== undefined) {
                    cacheData.missingFiles = cacheData.missingFiles.filter((path) => path !== data.payload);
                    cacheData.outdatedFiles = cacheData.outdatedFiles.filter((path) => path !== data.payload);
                    hashStore.cache.set(downloadStore.current.item.id, cacheData);
                }
            }
        });
        // await listen('hash_failed', (event: any) => {
        //     repoStore.filesFailed.push(event.payload);
        // });
    }

    public static async downloadFiles(repoId: string | null, modsetId: string | null, files: string[]): Promise<void> {
        const repoStore = useRepoStore();
        const settingsStore = useSettingsStore();
        const repo = repoStore.getRepo(repoId);
        if (repo === undefined) throw new Error(`Repository with id ${repoId} not found`);
        return await invoke('download', {
            repoType: repo.type?.toUpperCase(),
            url: repo.download_server?.url,
            targetPath: `${settingsStore.settings.downloadDirectoryPath}${System.SEPERATOR}`,
            fileArray: files,
        });
    }
}
