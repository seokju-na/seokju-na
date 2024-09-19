import type { Project, StreamReport, Workspace } from '@yarnpkg/core';
import type { AwsClients } from '../aws/clients';

export interface DeployContext {
  project: Project;
  workspace: Workspace;
  report: StreamReport;
  aws: AwsClients;
  serviceName: string;
  releaseId: string;
}
