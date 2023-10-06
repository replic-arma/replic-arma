import { readText, writeText } from '@tauri-apps/api/clipboard';

export async function readTextClipboard() {
    return await readText();
}

export async function writeTextClipboard(msg: string) {
    await writeText(msg);
}
