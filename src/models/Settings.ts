export class ApplicationSettings {
    public language = 'en';
    public theme = 'light';
    public gamePath: string | null = null;
    public downloadDirectoryPath: string | null = null;
    public maxDownloadSpeed = 0;
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
