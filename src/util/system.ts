import { invoke } from '@tauri-apps/api/tauri';
import { documentDir, sep } from '@tauri-apps/api/path';
import { createDir, BaseDirectory, writeFile, readTextFile } from '@tauri-apps/api/fs';
import { ApplicationSettings } from '@/models/Settings';
import { ReplicArmaRepository } from '@/models/Repository';
import { useSettingsStore } from '@/store/settings';
import { useRepoStore } from '@/store/repo';
export class System {
    private static APPDIR = 'Replic-Arma';
    private static DOCUMENTDIRECTORY = documentDir();

    public static setup (): void {
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
}
