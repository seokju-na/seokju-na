import { Cli } from 'clipanion';
import { DeployCommand } from './deploy/DeployCommand';

const [node, app, ...args] = process.argv;

const cli = new Cli({
  binaryLabel: 'seokju-na',
  binaryName: `${node} ${app}`,
  binaryVersion: '0.0.0',
});

cli.register(DeployCommand);
cli.runExit(args);
