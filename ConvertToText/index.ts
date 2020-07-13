import { AzureFunction, Context } from '@azure/functions';
import {
    generateBlobSASQueryParameters,
    ContainerSASPermissions,
    SASProtocol,
    StorageSharedKeyCredential,
} from '@azure/storage-blob';
import axios from 'axios';

import { getRequestBody, RequestBodyDto } from './getRequestBody';

import { expectAndGet } from '../Shared';
import { getUUIDFromUrl } from './getUUIDFromUrl';

const blobTrigger: AzureFunction = async (context: Context): Promise<void> => {
    context.log(`
        Blob trigger function processed blob 
        Name:' ${context.bindingData.name},
    `);

    const uri = expectAndGet<string>(context.bindingData.uri, 'Blob uri reuired');
    const srServiceRegion = expectAndGet<string>(process.env.SRServiceRegion, 'SR serivce region reuired');
    const srServiceSubscriptionKey = expectAndGet<string>(
        process.env.SRServiceSubscriptionKey,
        'SR serivce subscriptions key required',
    );
    const blobStorageSas = expectAndGet<string>(process.env.SRBlobStorageSas, 'SR blob storage sas required');

    const blobContainerName = expectAndGet<string>(
        process.env.SRStorageContainerName,
        'SR blob storage container name required',
    );

    const blobStorageAccount = expectAndGet<string>(
        process.env.SRBlobStorageAccount,
        'SR blob storage account required',
    );
    const blobStorageKey = expectAndGet<string>(process.env.SRBlobStorageKey, 'SR blob storage key required');

    const blobStorageContainerUrl = uri.substring(0, uri.lastIndexOf('/'));

    const startsOn = new Date();
    const expiresOn = new Date(startsOn);
    expiresOn.setDate(expiresOn.getDate() + 1);

    const sharedKeyCredentials = new StorageSharedKeyCredential(blobStorageAccount, blobStorageKey);

    const containerSas = generateBlobSASQueryParameters(
        {
            containerName: blobContainerName,
            permissions: ContainerSASPermissions.parse('w'),
            startsOn,
            expiresOn,
            protocol: SASProtocol.Https,
        },
        sharedKeyCredentials,
    );

    const body: RequestBodyDto = getRequestBody(
        `${uri}?${blobStorageSas}`,
        'testName',
        `${blobStorageContainerUrl}?${containerSas}`,
    );

    const result = await axios.post(`https://${srServiceRegion}.cris.ai/api/speechtotext/v2.0/Transcriptions`, body, {
        headers: {
            'Ocp-Apim-Subscription-Key': srServiceSubscriptionKey,
        },
    });

    const location = expectAndGet<string>(result.headers.location, 'location header not found');

    const filesTable = JSON.parse(context.bindings.filesTable || '{}');
    const srUuid = getUUIDFromUrl(location);

    return {
        [srUuid]: context.bindingData.name,
        ...filesTable,
    };
};

export default blobTrigger;
