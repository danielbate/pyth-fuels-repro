import { createConfig } from 'fuels';

export default createConfig({
  workspace: './sway-programs',
  output: './test-ts/src/sway-api',
  forcBuildFlags: ['--release'],
});