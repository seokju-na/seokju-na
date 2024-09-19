import { execa } from 'execa';
import type { DeployContext } from './DeployContext';

export async function runBuild({ workspace, releaseId }: DeployContext) {
  await execa('yarn', ['run', 'build'], {
    cwd: workspace.cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'production',
      RELEASE_ID: releaseId,
    },
  });
}
