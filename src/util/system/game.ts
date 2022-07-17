import type { Collection, GameServer, Modset, File, ModsetMod } from '@/models/Repository';
import type { GameLaunchSettings } from '@/models/Settings';
import { useRepoStore } from '@/store/repo';
import { useSettingsStore } from '@/store/settings';
import { invoke } from '@tauri-apps/api';
import { sep } from '@tauri-apps/api/path';
import { Command, type SpawnOptions } from '@tauri-apps/api/shell';

export async function launchCollection(collection: Collection, repoId: string) {
    const repo = useRepoStore().repos?.find((repo) => repo.id === repoId);
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
    const repo = useRepoStore().repos?.find((repo) => repo.id === repoId);
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
    const parameterString = `${getParsedLaunchOptions(launchOptions)}${modDlcString}${getConnectionString(gameServer)}`;
    await spawnProcess(settings.gamePath, parameterString, {});
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
    let parsedLaunchOptions = '';
    if (launchOptions.noPause) parsedLaunchOptions += ' -noPause';
    if (launchOptions.noSplash) parsedLaunchOptions += ' -noSplash';
    if (launchOptions.window) parsedLaunchOptions += ' -window';
    if (launchOptions.showScriptErrors) parsedLaunchOptions += ' -showScriptErrors';
    if (launchOptions.filePatching) parsedLaunchOptions += ' -filePatching';
    if (launchOptions.checkSignatures) parsedLaunchOptions += ' -checkSignatures';
    if (launchOptions.enableHT) parsedLaunchOptions += ' -enableHT';
    if (launchOptions.hugepages) parsedLaunchOptions += ' -hugepages';
    if (launchOptions.emptyWorld) parsedLaunchOptions += ' -world=empty';
    if (launchOptions.noLogs) parsedLaunchOptions += ' -nologs';
    if (launchOptions.maxMem !== 0) parsedLaunchOptions += ` -maxMem=${launchOptions.maxMem}`;
    if (launchOptions.cpuCount !== 0) parsedLaunchOptions += ` -cpuCount=${launchOptions.cpuCount}`;
    if (launchOptions.exThreads !== 0) parsedLaunchOptions += ` -exThreads=${launchOptions.exThreads}`;
    if (launchOptions.malloc !== '') parsedLaunchOptions += ` -malloc=${launchOptions.malloc}`;
    if (launchOptions.customParameter !== '') parsedLaunchOptions += ` ${launchOptions.customParameter}`;
    return parsedLaunchOptions;
}

async function spawnProcess(path: string, args: string, spawnOptions: SpawnOptions) {
    const command = new Command('run-game', ['/C', 'start', '', path, args], spawnOptions);
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
