import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import mimeTypes from 'mime-types';
import glob from 'tiny-glob';
import type { DeployContext } from './DeployContext';

export async function* uploadAssets({ cwd, aws, serviceName, releaseId }: DeployContext) {
  const files = await glob('**/*', {
    cwd: path.join(cwd, 'dist'),
    filesOnly: true,
  });
  for (const file of files) {
    const contentType = mimeTypes.lookup(file) || 'text/plain';
    const bucket = serviceName;
    const key = path.join(releaseId, file);
    const s3Path = `s3://${serviceName}/${key}`;
    try {
      await aws.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: await readFile(path.join(cwd, 'dist', file)),
          ContentType: contentType,
          CacheControl: getCacheControl(file),
        })
      );
      yield { success: true as const, file, s3Path };
    } catch (error) {
      yield { success: false as const, file, s3Path, error };
    }
  }
}

function getCacheControl(file: string) {
  if (file.endsWith('robots.txt') || file.endsWith('sitemap.xml')) {
    return 'max-age=60';
  }
  const contentType = mimeTypes.lookup(file) || 'text/plain';
  if (contentType.includes('text/html')) {
    return 'max-age=0, must-revalidate';
  }
  return 'public, max-age=31536000, immutable';
}
