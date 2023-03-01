export interface GameLaunchSettings {
    noPause: boolean;
    window: boolean;
    showScriptErrors: boolean;
    noSplash: boolean;
    name: string;
    checkSignatures: boolean;
    filePatching: boolean;
    maxMem: number;
    cpuCount: number;
    malloc: string;
    exThreads: number;
    enableHT: boolean;
    hugepages: boolean;
    emptyWorld: boolean;
    noLogs: boolean;
    customParameter: string;
    battleye: boolean;
    skipIntro: boolean;
}
export interface IApplicationSettings {
    language: string;
    theme: 'light' | 'dark';
    gamePath: string;
    downloadDirectoryPath: string;
    maxDownloadSpeed: number;
    maxConnections: number;
    launchOptions: GameLaunchSettings;
}
