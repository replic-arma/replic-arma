export interface IApplicationSettings {
    language: string;
    theme: 'light'|'dark';
    gamePath: string | null;
    downloadDirectoryPath: string | null;
    maxDownloadSpeed: number;
}

export class GameLaunchSettings {
    public noPause = false;
    public window = false;
    public showScriptErrors = false;
    public noSplash = false;
    public name: string | null = null;
    public checkSignatures = false;
    public filePatching = false;
    public maxMem: number | null = null;
    public cpuCount: number | null = null;
    public malloc: string | null = null;
    public exThreads: number | null = null;
    public enableHT = false;
    public hugepages = false;
    public emptyWorld = false;
    public noLogs = false;
    public customParameter: string | null = null;
    public battleye = false;
}
