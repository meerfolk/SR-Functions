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
    RecordingsUrl: string;

    Locale: string;

    Name: string;

    Description: string;

    Properties: RequestBodyPropertiesDto;

    constructor(recordingsUrl: string, name: string, resultContainerUrl: string) {
        this.RecordingsUrl = recordingsUrl;
        this.Locale = 'ru-RU';
        this.Name = name;
        this.Description = 'Description';
        this.Properties = new RequestBodyPropertiesDto(resultContainerUrl);
    }
}

export function getRequestBody(url: string, name: string, resultContainerUrl: string): RequestBodyDto {
    return new RequestBodyDto(url, name, resultContainerUrl);
}
