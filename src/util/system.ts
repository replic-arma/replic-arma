import { tauri } from '@tauri-apps/api';
import { BaseDirectory, createDir } from '@tauri-apps/api/fs';

export class System {
    public static setup () {
        // create config folder
        // createDir('Replic-Arma', { dir: BaseDirectory.Document }).then((bing) => { console.log(bing); });
        // create repo.json
    }

    public clearCache () {
        // TODO
    }

    public resetSettings () {
        // TODO
    }
}
