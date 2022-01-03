export interface ApplicationSettings {
    language: string;
    theme: string;
    gamePath: string;
    downloadDirectoryPath: string;
    maxDownloadSpeed: number;
}

export interface GameLaunchSettings {
    noPause: boolean;
    window: boolean;
    showScriptErrors: boolean;
    noSplash: boolean;
    name: string|null;
    checkSignatures:boolean;
    filePatching: boolean;
    maxMem: number|null;
    cpuCount: number|null;
    malloc: string|null;
    exThreads: number|null;
    enableHT: boolean;
    hugepages: boolean;
    emptyWorld: boolean;
    noLogs: boolean;
    customParameter: string;
    battleye: boolean;
}
