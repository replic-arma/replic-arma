// public static async launchGame(
//     repoId: string,
//     modsetId: string,
//     gameServer: GameServer | null = null
// ): Promise<void> {
//     const settingsStore = useSettingsStore();
//     if (settingsStore.settings.gamePath === null)
//         throw new Error('Game Executable not set, cannot launch the game');
//     if (settingsStore.settings.downloadDirectoryPath === null)
//         throw new Error('Mod Directoy not set, cannot launch the game');
//     const launchOptions = System.getModString(repoId, modsetId) + System.getConnectionString(gameServer);
//     const command = new Command(settingsStore.settings.gamePath, launchOptions);
//     command.on('close', (data) => {
//         console.log(`command finished with code ${data.code} and signal ${data.signal}`);
//     });
//     command.on('error', (error) => console.error(`command error: "${error}"`));
//     command.stdout.on('data', (line) => console.log(`command stdout: "${line}"`));
//     command.stderr.on('data', (line) => console.log(`command stderr: "${line}"`));

//     const child = await command.spawn();
//     console.log('pid:', child.pid);
// }

// private static getModString(repoId: string, modsetId: string) {
//     const settingsStore = useSettingsStore();
//     const repoStore = useRepoStore();
//     const modset = repoStore.getModset(repoId, modsetId);
//     if (modset === undefined) throw new Error(`Modset with name ${modsetId} not found`);
//     return `-mod=${modset?.mods
//         ?.map((mod) => {
//             return settingsStore.settings.downloadDirectoryPath + sep + mod.name;
//         })
//         .join(';')};`;
// }

// private static getConnectionString(gameServer: GameServer | null = null) {
//     if (gameServer === null) return '';
//     return `-ip=${gameServer.host};-port=${gameServer.port};-password=${gameServer.password};`;
// }
