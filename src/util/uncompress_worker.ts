import pako from 'pako';

addEventListener('message', async (event: MessageEvent) => {
    const data = event.data as Uint8Array;

    const shit = JSON.parse(pako.inflate(data, { to: 'string' }));

    self.postMessage(shit);
});
