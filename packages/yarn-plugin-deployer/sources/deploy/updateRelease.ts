import { DescribeKeyValueStoreCommand, PutKeyCommand } from '@aws-sdk/client-cloudfront-keyvaluestore';
import type { DeployContext } from './DeployContext';

const KV_ARN = 'arn:aws:cloudfront::967484304891:key-value-store/09618184-01c1-4d7f-9808-e8022500c2bf';

export async function updateRelease({ aws, serviceName, releaseId, report }: DeployContext) {
  const { ETag } = await aws.cloudfrontKv.send(
    new DescribeKeyValueStoreCommand({
      KvsARN: KV_ARN,
    })
  );
  const result = await aws.cloudfrontKv.send(
    new PutKeyCommand({
      KvsARN: KV_ARN,
      Key: serviceName,
      Value: releaseId,
      IfMatch: ETag,
    })
  );
  report.reportInfo(null, `update release to "${releaseId}" (etag=${ETag})`);
  return result;
}
