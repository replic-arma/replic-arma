import { attachConsole, debug, error, info, trace, warn } from 'tauri-plugin-log-api';

export enum LogType {
    UPDATER = 'Updater',
    UPDATER_REPO = 'Update Repo',
    HASH = 'Hash',
    ZSYNC = 'ZSync',
    DOWNLOAD = 'Download',
    UNKNOWN = 'Unknown'
}

function generateLogString(type: LogType, msg: string) {
    return `[${type}] ${msg}`;
}

export async function initLogger() {
    window.addEventListener('unhandledrejection', err => logError(LogType.UNKNOWN, err.reason));
    window.addEventListener('error', err => logError(LogType.UNKNOWN, err.error), true);
    await attachConsole();
}

export async function logInfo(type: LogType, msg: string) {
    await info(generateLogString(type, msg));
}

export async function logWarn(type: LogType, msg: string) {
    await warn(generateLogString(type, msg));
}

export async function logDebug(type: LogType, msg: string) {
    await debug(generateLogString(type, msg));
}

export async function logTrace(type: LogType, msg: string) {
    await trace(generateLogString(type, msg));
}

export async function logError(type: LogType, msg: string) {
    await error(generateLogString(type, msg));
}
