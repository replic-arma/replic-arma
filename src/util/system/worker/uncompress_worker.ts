import pako from 'pako';
import { readTextFile, BaseDirectory } from '@tauri-apps/api/fs';

console.log('shit', self.__TAURI_IPC__);

readTextFile('blub.txt', { dir: BaseDirectory.App }).then(console.log).catch(console.error);

addEventListener('message', async (event: MessageEvent) => {
    const data = event.data as Uint8Array;

    const shit = pako.inflate(data, { to: 'string' });

    self.postMessage(shit);
});
