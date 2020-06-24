import { AzureFunction, Context } from '@azure/functions';
import axios from 'axios';

import { getRequestBody, RequestBodyDto } from './getRequestBody';

import { expectAndGet } from '../Shared';

const blobTrigger: AzureFunction = async (context: Context, myBlob: any): Promise<void> => {
    context.log(`
        Blob trigger function processed blob 
        Name:' ${context.bindingData.name},
        Blob Size: ${myBlob.length},
    `);

    context.log(context.bindingData);

    const uri = expectAndGet<string>(context.bindingData.uri, 'Blob uri reuired');
    const srServiceRegion = expectAndGet<string>(process.env.SRServiceRegion, 'SR serivce region reuired');
    const srServiceSubscriptionKey = expectAndGet<string>(
        process.env.SRServiceSubscriptionKey,
        'SR serivce subscriptions key required',
    );
    const blobStorageSas = expectAndGet<string>(process.env.SRBlobStorageSas, 'SR blob storage sas required');

    const body: RequestBodyDto = getRequestBody(uri, 'testName', blobStorageSas);

    const result = await axios.post(`https://${srServiceRegion}.cris.ai/api/speechtotext/v2.0/Transcriptions`, body, {
        headers: {
            'Ocp-Apim-Subscription-Key': srServiceSubscriptionKey,
        },
    });

    context.log(result.headers);
};

export default blobTrigger;
