import type { Collection, GameServer, Modset, File, ModsetMod } from '@/models/Repository';
import { useRepoStore } from '@/store/repo';
import { useSettingsStore } from '@/store/settings';
import { sep } from '@tauri-apps/api/path';
import { Command, type SpawnOptions } from '@tauri-apps/api/shell';

export async function launchCollection(collection: Collection) {
    let mods: string[] = [];
    collection.modsets?.forEach((modsetId: string) => {
        const modset = useRepoStore().modsetCache?.find((cacheModset: Modset) => cacheModset.id === modsetId);
        if (modset !== undefined) {
            mods = [...modset.mods.flatMap((mod: ModsetMod) => mod.name ?? []), ...mods];
        }
    });
    await launchGame(mods, collection.dlc);
}

export async function launchModset(modsetId: string) {
    const currentModset = useRepoStore().modsetCache?.find((cacheModset: Modset) => cacheModset.id === modsetId);
    if (currentModset === null || currentModset === undefined) throw new Error('No settings, cannot launch the game');
    await launchGame(currentModset.mods.flatMap((mod: ModsetMod) => mod.name ?? []) ?? []);
}

export async function launchGame(
    mods: string[],
    dlc: string[] = [],
    gameServer: GameServer | null = null
): Promise<void> {
    const settings = useSettingsStore().settings;
    if (settings === null) throw new Error('No settings, cannot launch the game');
    if (settings.gamePath === null) throw new Error('Game Executable not set, cannot launch the game');
    if (settings.downloadDirectoryPath === null) throw new Error('Mod Directoy not set, cannot launch the game');
    // console.log(getModDlcString(mods, dlc));
    const launchOptions = getModDlcString(mods, dlc) + getConnectionString(gameServer);
    await spawnProcess(settings.gamePath, launchOptions, {});
}

function getModDlcString(mods: string[], dlc: string[]) {
    const settings = useSettingsStore().settings;
    if (settings === null) throw new Error('No settings, cannot launch the game');
    return `-mod=${[
        ...mods.map((mod) => {
            return settings.downloadDirectoryPath + sep + mod;
        }),
        ...dlc,
    ].join(';')};`;
}

function getConnectionString(gameServer: GameServer | null = null) {
    if (gameServer === null) return '';
    return `-ip=${gameServer.host};-port=${gameServer.port};-password=${gameServer.password};`;
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
