import { BlobServiceClient } from '@azure/storage-blob';
import { AzureFunction, Context } from '@azure/functions';

import { expectAndGet, tryCatchLogWrapper } from '../Shared';
import { getUUIDFromFileName } from './getUUIDFromFileName';

type Result = {
    AudioFileResults: {
        CombinedResults: {
            Display: string;
        };
    };
};
const blobTrigger: AzureFunction = async (context: Context, myBlob: Result): Promise<void> => {
    const fileTable = tryCatchLogWrapper<Record<string, string>>(
        context,
        () => JSON.parse(context.bindings.fileTable),
        'Fail to parse files table',
    );

    const blobName = expectAndGet<string>(context.bindingData.name, 'Blob name required');

    const srUuid = getUUIDFromFileName(blobName);

    const txtBlobName = expectAndGet(fileTable[srUuid], `Can't find record ${srUuid} if file table`);

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
        `https://${blobStorageAccount}.blob.core.windows.net${blobStorageSas}`,
    );
    const containerClient = blobServiceClient.getContainerClient(blobContainerName);

    const resultBlobBody = expectAndGet(
        myBlob.AudioFileResults.CombinedResults.Display,
        `Can't find display in combined result`,
    );

    await containerClient.uploadBlockBlob(`${txtBlobName}.txt`, resultBlobBody, resultBlobBody.length);
};

export default blobTrigger;
