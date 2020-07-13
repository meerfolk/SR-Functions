import { isUUID } from '../Shared';

export function getUUIDFromFileName(name: string): string {
    const uuid = name.substring(name.indexOf('_'));

    if (!isUUID(uuid)) {
        throw new Error(`Failed uuid extraction from ${name}`);
    }

    return uuid;
}
