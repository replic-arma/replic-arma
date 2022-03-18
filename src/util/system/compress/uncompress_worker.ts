import pako from 'pako';

addEventListener('message', async (event: MessageEvent) => {
    const data = event.data as Uint8Array;

    const shit = pako.inflate(data, { to: 'string' });

    self.postMessage(shit);
});
