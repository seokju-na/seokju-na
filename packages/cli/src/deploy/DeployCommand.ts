import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import chalk from 'chalk';
import { Command } from 'clipanion';
import type { PackageJson } from 'type-fest';
import { getAwsClients } from '../aws/clients';
import { getCommitId } from '../git/getCommitId';
import type { DeployContext } from './DeployContext';
import { runBuild } from './runBuild';
import { updateRelease } from './updateRelease';
import { uploadAssets } from './uploadAssets';

export class DeployCommand extends Command {
  static paths = [['deploy']];

  async execute() {
    const cwd = process.cwd();
    const pkgRaw = await readFile(path.join(cwd, 'package.json'), 'utf8');
    const pkg: PackageJson = JSON.parse(pkgRaw);
    const getAwsCredentials = fromNodeProviderChain();
    const aws = getAwsClients({
      region: 'ap-northeast-2',
      credentials: await getAwsCredentials(),
    });
    const context: DeployContext = {
      aws,
      cwd,
      pkg,
      serviceName: pkg.name!,
      releaseId: await getCommitId(),
    };
    this.context.stdout.write(
      `deploy for ${chalk.green(context.serviceName)} ${chalk.yellow(`[${context.releaseId}]`)}\n`
    );
    let hasError = false;
    await runBuild(context);
    for await (const result of uploadAssets(context)) {
      this.context.stdout.write(
        `upload asset ${result.success ? 'succeed' : 'failed'}: ${result.s3Path} ${result.error != null ? `(${(result.error as Error)?.message})` : ''}`
      );
      if (!result.success) {
        hasError = true;
      }
    }
    if (hasError) {
      return 1;
    }
    await updateRelease(context);
  }
}
