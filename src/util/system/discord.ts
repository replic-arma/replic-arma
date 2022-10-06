import { invoke } from '@tauri-apps/api';

export async function updateActivity() {
    await invoke('discord_set_activity', {
        details: 'Fumbling with Mods',
        state: `🚜`,
        timestamp: Date.now(),
        image: 'replicarma_large'
    });
}
