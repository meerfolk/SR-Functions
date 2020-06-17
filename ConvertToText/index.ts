import { AzureFunction, Context } from '@azure/functions';

import { getRequestBody, RequestBodyDto } from './getRequestBody';

import { expectAndGet } from '../Shared';

const blobTrigger: AzureFunction = async (context: Context, myBlob: any): Promise<void> => {
    context.log(`
        Blob trigger function processed blob 
        Name:' ${context.bindingData.name},
        Blob Size: ${myBlob.length},
    `);

    const path = expectAndGet<string>(context.bindingData.path, 'Blob path not found');

    const body: RequestBodyDto = getRequestBody(path, 'testName', 'testUrl');
};

export default blobTrigger;
