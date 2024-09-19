import type { PackageJson } from 'type-fest';
import type { AwsClients } from '../aws/clients';

export interface DeployContext {
  aws: AwsClients;
  pkg: PackageJson;
  cwd: string;
  serviceName: string;
  releaseId: string;
}
