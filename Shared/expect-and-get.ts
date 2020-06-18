export function expectAndGet<T>(data: T, errorMessage: string): T {
    if (!data) {
        throw new Error(errorMessage);
    }

    return data;
}
