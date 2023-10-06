import CompressWorker from './compress_worker?worker';
import UncompressWorker from './uncompress_worker?worker';

export async function compress(data: string) {
    const worker = new CompressWorker();

    const promise = new Promise<Uint8Array>(resolve => {
        worker.addEventListener(
            'message',
            e => {
                resolve(e.data);
            },
            { once: true }
        );
    });

    worker.postMessage(data);
    return promise;
}

export async function uncompress(data: Uint8Array): Promise<string> {
    const worker = new UncompressWorker();

    const promise = new Promise<string>(resolve => {
        worker.addEventListener(
            'message',
            e => {
                resolve(e.data);
            },
            { once: true }
        );
    });

    worker.postMessage(data, [data.buffer]);
    return promise;
}
