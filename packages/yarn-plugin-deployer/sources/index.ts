import type { Plugin } from '@yarnpkg/core';
import { DeployCommand } from './deploy/DeployCommand';

const plugin: Plugin = {
  commands: [DeployCommand],
};
export { plugin as default };
