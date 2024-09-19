import { fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { BaseCommand, WorkspaceRequiredError } from '@yarnpkg/cli';
import { Configuration, Project, StreamReport } from '@yarnpkg/core';
import chalk from 'chalk';
import { getAwsClients } from '../aws/clients';
import { getCommitId } from '../git/getCommitId';
import type { DeployContext } from './DeployContext';
import { runBuild } from './runBuild';
import { updateRelease } from './updateRelease';
import { uploadAssets } from './uploadAssets';

export class DeployCommand extends BaseCommand {
  static paths = [['deployer', 'deploy']];

  async execute() {
    const configuration = await Configuration.find(this.context.cwd, this.context.plugins);
    const { project, workspace } = await Project.find(configuration, this.context.cwd);
    if (workspace == null || workspace.manifest.name == null) {
      throw new WorkspaceRequiredError(project.cwd, this.context.cwd);
    }
    const report = await StreamReport.start(
      {
        configuration,
        stdout: this.context.stdout,
      },
      async report => {
        const getAwsCredentials = fromNodeProviderChain();
        const aws = getAwsClients({
          region: 'ap-northeast-2',
          credentials: await getAwsCredentials(),
        });
        const context: DeployContext = {
          project,
          workspace,
          report,
          aws,
          serviceName: workspace.manifest.name!.name,
          releaseId: await getCommitId(),
        };
        report.reportInfo(
          null,
          `deploy for ${chalk.green(context.serviceName)} ${chalk.yellow(`[${context.releaseId}]`)}`
        );
        const progress = StreamReport.progressViaTitle();
        progress.setTitle('start building...');
        const reportedProgress = report.reportProgress(progress);
        await runBuild(context);
        await reportedProgress;
        await uploadAssets(context);
        await updateRelease(context);
      }
    );
    return report.exitCode();
  }
}
