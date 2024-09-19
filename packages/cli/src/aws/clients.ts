import { CloudFrontKeyValueStoreClient } from '@aws-sdk/client-cloudfront-keyvaluestore';
import { S3Client } from '@aws-sdk/client-s3';
import '@aws-sdk/signature-v4-crt';
import { SignatureV4MultiRegion } from '@aws-sdk/signature-v4-multi-region';
import memoize from 'memoize';

export interface AwsClients {
  s3: S3Client;
  cloudfrontKv: CloudFrontKeyValueStoreClient;
}

interface Options {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

export const getAwsClients = memoize(({ region, credentials }: Options) => {
  const s3 = new S3Client({ region, credentials });
  const cloudfrontKv = new CloudFrontKeyValueStoreClient({
    region,
    credentials,
    signerConstructor: SignatureV4MultiRegion,
  });
  const clients: AwsClients = { s3, cloudfrontKv };
  return clients;
});
