import { writeFile } from 'fs';
import fetch from 'node-fetch';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import pjson from '../package.json' assert { type: 'json' };
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);
const root = resolve(__dirname);

const source = root + '/../website/public/latest.json';

const content = {
    version: 'v' + pjson.version,
    notes: `Changelog: ${pjson.repository.url}/releases/${pjson.name}-v${pjson.version}`,
    pub_date: new Date().toISOString(),
    platforms: {
        'linux-x86_64': {
            signature: await getSignature(
                `${pjson.repository.url}/releases/download/${pjson.name}-v${pjson.version}/${pjson.displayName}.app.tar.gz.sig`
            ),
            url: `${pjson.repository.url}/releases/download/${pjson.name}-v${pjson.version}/${pjson.displayName}.app.tar.gz`
        },
        'windows-x86_64': {
            signature: await getSignature(
                `${pjson.repository.url}/releases/download/${pjson.name}-v${pjson.version}/${pjson.displayName}_${pjson.version}_x64_en-US.msi.zip.sig`
            ),
            url: `${pjson.repository.url}/releases/download/${pjson.name}-v${pjson.version}/${pjson.displayName}_${pjson.version}_x64_en-US.msi.zip`
        }
    }
};

await writeFile(source, JSON.stringify(content), 'utf8', function (err) {
    if (err) return console.log(err);
});

async function getSignature(path) {
    try {
        const sigfile = await fetch(path);
        if (sigfile.status !== 200) return '';
        return await sigfile.text();
    } catch (e) {
        return '';
    }
}
