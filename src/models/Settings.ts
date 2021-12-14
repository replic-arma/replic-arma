export interface ApplicationSettings {
    language: string;
    theme: number;
    gamePath: string;
    downloadDirectoryPath: string;
    maxDownloadSpeed: number;
}

export interface GameLaunchSettings {
    noPause: boolean;
    window: boolean;
    showScriptErrors: boolean;
    noSplash: boolean;
    name?: string;
    checkSignatures:boolean;
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
}
