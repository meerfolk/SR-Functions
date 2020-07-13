import { Context } from '@azure/functions';

export function tryCatchLogWrapper<T>(context: Context, handler: () => T, failMessage: string): T {
    try {
        return handler();
    } catch (error) {
        context.log.error(error);
        throw new Error(failMessage);
    }
}
