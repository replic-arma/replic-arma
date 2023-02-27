import { listen } from '@tauri-apps/api/event';
import type { Event as TauriEvent } from '@tauri-apps/api/helpers/event';
import TypedEventTarget from '../TypedEventTarget';

interface DeepLink {
    deep_link_received: CustomEvent<{ payload: string }>;
}

export const DEEP_LINK = new TypedEventTarget<DeepLink>();
await listen('scheme-request-received', (e: TauriEvent<string>) => {
    const event = new CustomEvent('deep_link_received', { detail: { payload: e.payload } });
    DEEP_LINK.dispatchTypedEvent('deep_link_received', event);
});
