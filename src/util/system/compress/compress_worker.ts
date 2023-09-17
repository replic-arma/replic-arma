import pako from 'pako';

addEventListener('message', async (event: MessageEvent) => {
    const data = event.data as string;

    const compressed = pako.deflate(data);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    /* @ts-ignore */
    self.postMessage(compressed, [compressed.buffer]);
});
