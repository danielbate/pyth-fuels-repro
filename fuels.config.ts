import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
    './pyth-crosschain/pyth-contract',
    './sway-programs/contract'
  ],
  output: './test-ts/src',
  forcBuildFlags: ['--release']
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */