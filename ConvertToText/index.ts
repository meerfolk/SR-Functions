import { AzureFunction, Context } from '@azure/functions';

import { getRequestBody, RequestBodyDto } from './getRequestBody';

import { expectAndGet } from '../Shared';

const blobTrigger: AzureFunction = async (context: Context, myBlob: any): Promise<void> => {
    context.log(`
        Blob trigger function processed blob 
        Name:' ${context.bindingData.name},
        Blob Size: ${myBlob.length},
    `);

    context.log(context.bindingData);

    const uri = expectAndGet<string>(context.bindingData.uri, 'Blob uri not found');

    const body: RequestBodyDto = getRequestBody(uri, 'testName', 'testUrl');

    context.log(body);
};

export default blobTrigger;
