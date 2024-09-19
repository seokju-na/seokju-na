import { DescribeKeyValueStoreCommand, PutKeyCommand } from '@aws-sdk/client-cloudfront-keyvaluestore';
import type { DeployContext } from './DeployContext';

export async function updateRelease({ aws, serviceName, releaseId }: DeployContext) {
  const { ETag } = await aws.cloudfrontKv.send(
    new DescribeKeyValueStoreCommand({
      KvsARN: process.env.AWS_CF_KV_ARN,
    })
  );
  const result = await aws.cloudfrontKv.send(
    new PutKeyCommand({
      KvsARN: process.env.AWS_CF_KV_ARN,
      Key: serviceName,
      Value: releaseId,
      IfMatch: ETag,
    })
  );
  console.log(`update release: ${releaseId} (etag=${result.ETag})`);
  return result;
}
