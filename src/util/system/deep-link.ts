import { listen, type Event as TauriEvent } from '@tauri-apps/api/event';
import { TypedEventTarget } from 'typescript-event-target';

interface DeepLink {
    deep_link_received: CustomEvent<{ payload: string }>;
}

export const DEEP_LINK = new TypedEventTarget<DeepLink>();

export async function setupListener() {
    const schemeRequestReceived = await listen('scheme-request-received', (e: TauriEvent<string>) => {
        const event = new CustomEvent('deep_link_received', { detail: { payload: e.payload } });
        DEEP_LINK.dispatchTypedEvent('deep_link_received', event);
    });
    return [schemeRequestReceived];
}
