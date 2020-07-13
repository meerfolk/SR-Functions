import { BlobServiceClient } from '@azure/storage-blob';
import { AzureFunction, Context } from '@azure/functions';

import { expectAndGet, tryCatchLogWrapper } from '../Shared';
import { getUUIDFromFileName } from './getUUIDFromFileName';

type Result = {
    AudioFileResults: [
        {
            CombinedResults: [
                {
                    Display: string;
                },
            ];
        },
    ];
};

const blobTrigger: AzureFunction = async (context: Context, myBlob: Buffer): Promise<void> => {
    const blobName = expectAndGet<string>(context.bindingData.name, 'Blob name required');

    const srUuid = getUUIDFromFileName(blobName);

    const txtBlobName = expectAndGet(context.bindings.filesTable[srUuid], `Can't find record ${srUuid} if file table`);

    const blobStorageAccount = expectAndGet<string>(
        process.env.SRBlobStorageAccount,
        'SR blob storage account required',
    );

    const blobStorageSas = expectAndGet<string>(process.env.SRBlobStorageSas, 'SR blob storage sas required');

    const blobContainerName = expectAndGet<string>(
        process.env.SRStorageContainerName,
        'SR blob storage container name required',
    );

    const blobServiceClient = new BlobServiceClient(
        `https://${blobStorageAccount}.blob.core.windows.net?${blobStorageSas}`,
    );
    const containerClient = blobServiceClient.getContainerClient(blobContainerName);

    const blobObj = tryCatchLogWrapper<Result>(
        context,
        () => JSON.parse(myBlob.toString('utf8')),
        'Failed parsing blob buffer to string',
    );

    const combinedResults = expectAndGet(
        blobObj.AudioFileResults[0].CombinedResults,
        `Can't find display in combined result`,
    );

    const resultBlobBody = combinedResults.reduce((memo, item) => memo + `${item.Display}\n`, '');

    await containerClient.uploadBlockBlob(`${txtBlobName}.txt`, resultBlobBody, resultBlobBody.length);
};

export default blobTrigger;
