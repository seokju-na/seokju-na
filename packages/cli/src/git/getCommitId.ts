import { execa } from 'execa';

export async function getCommitId() {
  const { stdout } = await execa('git', ['rev-parse', 'HEAD'], {
    stripFinalNewline: true,
  });
  return stdout.trim();
}
