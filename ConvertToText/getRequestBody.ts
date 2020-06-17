class RequestBodyPropertiesDto {
    ProfanityFilterMode: 'None' | 'Removed' | 'Tags' | 'Masked';
    PunctuationMode: 'None' | 'Dictated' | 'Automatic' | 'DictatedAndAutomatic';
    AddWordLevelTimestamps: 'True' | 'False';
    AddSentiment: 'True' | 'False';
    AddDiarization: 'True' | 'False';
    TranscriptionResultsContainerUrl: string;

    constructor(transcriptionResultsContainerUrl: string) {
        this.ProfanityFilterMode = 'None';
        this.PunctuationMode = 'None';
        this.AddSentiment = 'False';
        this.AddDiarization = 'False';
        this.TranscriptionResultsContainerUrl = transcriptionResultsContainerUrl;
    }
}

export class RequestBodyDto {
    recordingsUrl: string;

    locale: string;

    name: string;

    description: string;

    properties: RequestBodyPropertiesDto;

    constructor(recordingsUrl: string, name: string, resultContainerUrl: string) {
        this.recordingsUrl = recordingsUrl;
        this.locale = 'ru-RU';
        this.name = name;
        this.description = 'Description';
        this.properties = new RequestBodyPropertiesDto(resultContainerUrl);
    }
}

export function getRequestBody(url: string, name: string, resultContainerUrl: string): RequestBodyDto {
    return new RequestBodyDto(url, name, resultContainerUrl);
}
