import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { MessageName } from '@yarnpkg/core';
import mimeTypes from 'mime-types';
import glob from 'tiny-glob';
import type { DeployContext } from './DeployContext';

export async function uploadAssets({ workspace, aws, report, serviceName, releaseId }: DeployContext) {
  const files = await glob('**/*', {
    cwd: path.join(workspace.cwd, 'dist'),
    filesOnly: true,
  });
  for (const file of files) {
    const contentType = mimeTypes.lookup(file) || 'text/plain';
    try {
      const bucket = serviceName;
      const key = path.join(releaseId, file);
      await aws.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: await readFile(path.join(workspace.cwd, 'dist', file)),
          ContentType: contentType,
          CacheControl: getCacheControl(file),
        })
      );
      report.reportInfo(null, `asset uploaded: ${file} (s3://${serviceName}/${key})`);
    } catch (e) {
      report.reportError(MessageName.EXCEPTION, `aws upload error: ${(e as Error)?.message}`);
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
