import type { Collection, GameServer, Modset, File, ModsetMod, IReplicArmaRepository } from '@/models/Repository';
import type { GameLaunchSettings } from '@/models/Settings';
import { useRepoStore } from '@/store/repo';
import { useSettingsStore } from '@/store/settings';
import { invoke } from '@tauri-apps/api';
import { sep } from '@tauri-apps/api/path';
import { Command, type SpawnOptions } from '@tauri-apps/api/shell';

export async function launchCollection(collection: Collection, repoId: string) {
    const repo = useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === repoId);
    await launchGame(
        repo!.launchOptions,
        getModDlcString(
            repo?.downloadDirectoryPath ?? '',
            Object.values(collection.modsets).flat(),
            collection.dlc ?? []
        )
    );
}

export async function launchModset(modsetId: string, repoId: string) {
    const currentModset = useRepoStore().modsetCache?.find((cacheModset: Modset) => cacheModset.id === modsetId);
    if (currentModset === null || currentModset === undefined) throw new Error('No settings, cannot launch the game');
    const repo = useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === repoId);
    await launchGame(
        repo!.launchOptions,
        getModDlcString(
            repo?.downloadDirectoryPath ?? '',
            currentModset.mods.flatMap((mod: ModsetMod) => mod.name ?? []),
            []
        )
    );
}

export async function launchGame(
    launchOptions: GameLaunchSettings,
    modDlcString: string,
    gameServer: GameServer | null = null
): Promise<void> {
    const settings = useSettingsStore().settings;
    if (settings === null) throw new Error('No settings, cannot launch the game');
    if (settings.gamePath === null) throw new Error('Game Executable not set, cannot launch the game');
    await spawnProcess(
        settings.gamePath,
        getParsedLaunchOptions(launchOptions),
        getConnectionString(gameServer),
        modDlcString,
        {}
    );
}

function getModDlcString(directory: string, mods: string[], dlc: string[]) {
    let arrMods: string[] = [];
    mods.forEach((modName: string) => {
        arrMods = [...arrMods, ...[`${directory}${sep}${modName}`]];
    });

    return ` -mod=${[...arrMods, ...dlc].join(';')};`;
}

function getConnectionString(gameServer: GameServer | null = null) {
    if (gameServer === null) return '';
    return ` -ip=${gameServer.host};-port=${gameServer.port};-password=${gameServer.password};`;
}

function getParsedLaunchOptions(launchOptions: GameLaunchSettings) {
    const parsedLaunchOptions: string[] = [];
    if (launchOptions.noPause) parsedLaunchOptions.push('-noPause');
    if (launchOptions.noSplash) parsedLaunchOptions.push('-nosplash');
    if (launchOptions.window) parsedLaunchOptions.push('-window');
    if (launchOptions.showScriptErrors) parsedLaunchOptions.push('-showScriptErrors');
    if (launchOptions.filePatching) parsedLaunchOptions.push('-filePatching');
    if (launchOptions.checkSignatures) parsedLaunchOptions.push('-checkSignatures');
    if (launchOptions.enableHT) parsedLaunchOptions.push('-enableHT');
    if (launchOptions.hugepages) parsedLaunchOptions.push('-hugepages');
    if (launchOptions.emptyWorld) parsedLaunchOptions.push('-world=empty');
    if (launchOptions.noLogs) parsedLaunchOptions.push('-nologs');
    if (launchOptions.skipIntro) parsedLaunchOptions.push('-skipIntro');
    if (launchOptions.maxMem !== 0) parsedLaunchOptions.push(`-maxMem=${launchOptions.maxMem}`);
    if (launchOptions.cpuCount !== 0) parsedLaunchOptions.push(`-cpuCount=${launchOptions.cpuCount}`);
    if (launchOptions.exThreads !== 0) parsedLaunchOptions.push(`-exThreads=${launchOptions.exThreads}`);
    if (launchOptions.malloc !== '') parsedLaunchOptions.push(`-malloc=${launchOptions.malloc}`);
    if (launchOptions.customParameter !== '') parsedLaunchOptions.push(`${launchOptions.customParameter}`);
    return parsedLaunchOptions.join(' ');
}

async function spawnProcess(
    path: string,
    mods: string,
    launchOptions: string,
    connection: string,
    spawnOptions: SpawnOptions
) {
    const command = new Command('run-game', ['/C', 'start', '', path, mods, launchOptions, connection], spawnOptions);
    command.on('close', (data) => {
        console.log(`command finished with code ${data.code} and signal ${data.signal}`);
    });

    command.on('error', (error) => console.error(`command error: "${error}"`));
    command.stdout.on('data', (line) => console.log(`command stdout: "${line}"`));
    command.stderr.on('data', (line) => console.log(`command stderr: "${line}"`));

    const child = await command.spawn();
    console.log('pid:', child.pid);
}

export async function getA3PathRegistry(): Promise<string> {
    return await invoke('get_a3_dir');
}
