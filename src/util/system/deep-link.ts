import { listen } from '@tauri-apps/api/event';
import type { Event as TauriEvent } from '@tauri-apps/api/helpers/event';
import TypedEventTarget from '../TypedEventTarget';

interface DeepLink {
    payload: CustomEvent<{ payload: string }>;
}

export const DEEP_LINK = new TypedEventTarget<DeepLink>();
listen('scheme-request-received', (e: TauriEvent<string>) => {
    const event = new CustomEvent('deep_link', { detail: { payload: e.payload } });
    DEEP_LINK.dispatchTypedEvent('payload', event);
});
