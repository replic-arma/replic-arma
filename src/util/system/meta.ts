import { getTauriVersion, getVersion } from '@tauri-apps/api/app';

export async function getCurrentTauriVersion() {
    return await getTauriVersion();
}
export async function getAppVersion() {
    return await getVersion();
}
