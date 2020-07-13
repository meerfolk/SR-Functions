import { getUUIDFromFileName } from '.';

describe('getUUIDFromFileName', () => {
    it('should return uuid', () => {
        expect(getUUIDFromFileName('3c5464ce-7d43-4fee-abe7-24a173fc99cd_transcription_channel_0')).toEqual(
            '3c5464ce-7d43-4fee-abe7-24a173fc99cd',
        );
    });

    it('should throw error', () => {
        expect(() => getUUIDFromFileName('test')).toThrowError(new Error('Failed uuid extraction from test'));
    });
});
