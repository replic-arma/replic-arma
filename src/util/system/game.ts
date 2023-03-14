import type { Collection, GameServer, IReplicArmaRepository, Modset, ModsetMod } from '@/models/Repository';
import type { GameLaunchSettings } from '@/models/Settings';
import { useHashStore } from '@/store/hash';
import { useRepoStore } from '@/store/repo';
import { useSettingsStore } from '@/store/settings';
import { invoke } from '@tauri-apps/api';
import { dirname, sep } from '@tauri-apps/api/path';
import { Command, type SpawnOptions } from '@tauri-apps/api/shell';
import type { HashResponseItem } from './hashes';
import { logInfo, LogType } from './logger';

export function launchCollectionByID(collectionID: string, repositoryID: string) {
    const repository = useRepoStore().repos?.find(
        (repository: IReplicArmaRepository) => repository.id === repositoryID
    );
    const collection = repository?.collections.find(collection => collection.id === collectionID);
    if (collection === null || collection === undefined) throw new Error('No collection found, cannot launch the game');
    launchCollection(collection, repositoryID);
}

export function launchCollection(collection: Collection, repoId: string) {
    const repo = useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === repoId);
    launchGame(
        repo!.launchOptions,
        getModDlcString(
            repo?.downloadDirectoryPath ?? '',
            filterMods(repoId, Object.values(collection.modsets).flat()),
            collection.dlc ?? [],
            collection.localMods?.map(localMod => localMod.path ?? '') ?? []
        )
    );
}

export function launchModset(modsetId: string, repoId: string, gameServer: GameServer | null = null) {
    const currentModset = useRepoStore().modsetCache?.find((cacheModset: Modset) => cacheModset.id === modsetId);
    if (currentModset === null || currentModset === undefined)
        throw new Error('No modset found, cannot launch the game');
    const repo = useRepoStore().repos?.find((repo: IReplicArmaRepository) => repo.id === repoId);
    launchGame(
        repo!.launchOptions,
        getModDlcString(
            repo?.downloadDirectoryPath ?? '',
            filterMods(
                repoId,
                currentModset.mods.flatMap((mod: ModsetMod) => mod.name ?? [])
            ),
            []
        ),
        gameServer
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
    if (launchOptions.battleye) {
        settings.gamePath = `${await dirname(settings.gamePath)}${sep}arma3battleye.exe`;
    }
    await spawnProcess(
        settings.gamePath,
        modDlcString,
        getParsedLaunchOptions(launchOptions),
        getConnectionString(gameServer),
        {}
    );
}

function filterMods(repoId: string, modNames: string[]) {
    const cacheData = useHashStore().cache.get(repoId);
    if (cacheData === undefined) return modNames;
    if (cacheData.missing.length > 0) {
        const missingMods = cacheData.missing.map((mod: HashResponseItem) => mod.file);
        return modNames.filter((modName: string) => !missingMods.includes(modName));
    }
    return modNames;
}

function getModDlcString(directory: string, mods: string[], dlc: string[] = [], localMods: string[] = []) {
    let arrMods: string[] = [];
    mods.forEach((modName: string) => {
        arrMods = [...arrMods, ...[`${directory}${sep}${modName}`]];
    });

    return ` -mod=${[...arrMods, ...dlc, ...localMods].join(';')};`;
}

function getConnectionString(gameServer: GameServer | null = null) {
    if (gameServer === null) return '';
    return ` -ip=${gameServer.host};-port=${gameServer.port};-password=${gameServer.password};`;
}

function getParsedLaunchOptions(launchOptions: GameLaunchSettings) {
    const parsedLaunchOptions: string[] = [];
    if (launchOptions.noPause) parsedLaunchOptions.push('-noPause');
    if (launchOptions.noSplash) parsedLaunchOptions.push('-noSplash');
    if (launchOptions.window) parsedLaunchOptions.push('-window');
    if (launchOptions.showScriptErrors) parsedLaunchOptions.push('-showScriptErrors');
    if (launchOptions.filePatching) parsedLaunchOptions.push('-filePatching');
    if (launchOptions.checkSignatures) parsedLaunchOptions.push('-checkSignatures');
    if (launchOptions.enableHT) parsedLaunchOptions.push('-enableHT');
    if (launchOptions.hugepages) parsedLaunchOptions.push('-hugepages');
    if (launchOptions.emptyWorld) parsedLaunchOptions.push('-world=empty');
    if (launchOptions.noLogs) parsedLaunchOptions.push('-nologs');
    if (launchOptions.noPauseAudio) parsedLaunchOptions.push('-noPauseAudio');
    if (launchOptions.debug) parsedLaunchOptions.push('-debug');
    if (launchOptions.crashDiag) parsedLaunchOptions.push('-crashDiag');
    if (launchOptions.debugCallExtension) parsedLaunchOptions.push('-debugCallExtension');
    if (launchOptions.noLand) parsedLaunchOptions.push('-noLand');
    if (launchOptions.skipIntro) parsedLaunchOptions.push('-skipIntro');
    if (launchOptions.maxMem !== 0) parsedLaunchOptions.push(`-maxMem=${launchOptions.maxMem}`);
    if (launchOptions.cpuCount !== 0) parsedLaunchOptions.push(`-cpuCount=${launchOptions.cpuCount}`);
    if (launchOptions.exThreads !== 0) parsedLaunchOptions.push(`-exThreads=${launchOptions.exThreads}`);
    if (launchOptions.malloc !== '') parsedLaunchOptions.push(`-malloc=${launchOptions.malloc}`);
    if (launchOptions.name !== '') parsedLaunchOptions.push(`-name=${launchOptions.name}`);
    if (launchOptions.customParameter !== '') parsedLaunchOptions.push(`${launchOptions.customParameter}`);
    return parsedLaunchOptions;
}

async function spawnProcess(
    path: string,
    mods: string,
    launchOptions: string[],
    connection: string,
    spawnOptions: SpawnOptions
) {
    const command = new Command(
        'run-game',
        ['/C', 'start', '', path, ...launchOptions, mods, connection],
        spawnOptions
    );
    logInfo(
        LogType.GAME,
        `Launching Game. Params: ${['/C', 'start', '', path, ...launchOptions, mods, connection].join(' ')}`
    );
    command.on('close', data => {
        logInfo(LogType.GAME, `finished with code ${data.code} and signal ${data.signal}`);
    });
    command.on('error', error => console.error(`command error: "${error}"`));
    command.stdout.on('data', line => console.debug(`command stdout: "${line}"`));
    command.stderr.on('data', line => console.debug(`command stderr: "${line}"`));
    const child = await command.spawn();
    console.debug('pid:', child.pid);
}

export async function getA3PathRegistry(): Promise<string> {
    return await invoke('get_a3_dir');
}
