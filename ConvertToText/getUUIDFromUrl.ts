import { isUUID } from '../Shared';

export function getUUIDFromUrl(url: string): string {
    const uuid = url.substring(url.lastIndexOf('/') + 1);

    if (!isUUID(uuid)) {
        throw new Error(`Failed UUID extraction from ${url}`);
    }

    return uuid;
}
