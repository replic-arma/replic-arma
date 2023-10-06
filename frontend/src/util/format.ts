const BASE = 1000;

const EXTENSIONS = ['B', 'KB', 'MB', 'GB'];

export function formatSize(val: number, decimals = 2) {
    let index = 0;
    for (index = 0; index < 3; index++) {
        if (val / BASE < 1) break;

        val = val / BASE;
    }

    return `${val.toFixed(decimals)} ${EXTENSIONS[index]}`;
}

export function resolveModNameFromPath(path: string) {
    return path.split('\\')[0] ?? '';
}
