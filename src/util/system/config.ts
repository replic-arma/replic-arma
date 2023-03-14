import type { GameLaunchSettings, IApplicationSettings } from '@/models/Settings';
import { ensureAppDir, fileExists, readTextFile, removeFile, writeTextFile } from './fs';

const FILE_NAME = 'config.json.gz';
export const DEFAULT_LAUNCH_CONFIG: GameLaunchSettings = {
    noPause: false,
    window: false,
    showScriptErrors: false,
    noSplash: false,
    name: '',
    checkSignatures: false,
    filePatching: false,
    maxMem: 0,
    cpuCount: 0,
    malloc: '',
    exThreads: 0,
    enableHT: false,
    hugepages: false,
    emptyWorld: false,
    noLogs: false,
    customParameter: '',
    battleye: false,
    skipIntro: false,
    noPauseAudio: false,
    debug: false,
    crashDiag: false,
    debugCallExtension: false,
    noLand: false
};

const DEFAULT_CONFIG: IApplicationSettings = {
    language: 'en',
    gamePath: '',
    downloadDirectoryPath: '',
    theme: 'light',
    maxDownloadSpeed: 0,
    launchOptions: DEFAULT_LAUNCH_CONFIG,
    maxConnections: 10,
    checkRepositoriesOnStartup: true
};

export async function loadConfig(): Promise<IApplicationSettings> {
    const exists = await fileExists(FILE_NAME);
    if (!exists) return DEFAULT_CONFIG;

    const str = await readTextFile(FILE_NAME);
    return JSON.parse(str);
}

export async function saveConfig(contents: IApplicationSettings): Promise<void> {
    await ensureAppDir();

    return writeTextFile(FILE_NAME, JSON.stringify(contents));
}

export async function resetConfig(): Promise<IApplicationSettings> {
    const exists = await fileExists(FILE_NAME);

    if (exists) {
        removeFile(FILE_NAME);
    }

    return DEFAULT_CONFIG;
}
