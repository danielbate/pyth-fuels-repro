import { createConfig } from 'fuels';
import dotenv from 'dotenv';

dotenv.config({
  path: ['.env.local', '.env'],
});

const fuelCorePort = +(process.env.NEXT_PUBLIC_FUEL_NODE_PORT as string) || 4000;

export default createConfig({
  // workspace: './pyth-crosschain',
  // output: './src/pyth-crosschain-api',
  workspace: './sway-programs',
  output: './src/sway-api',
  fuelCorePort,
  providerUrl: 'https://testnet.fuel.network/v1/graphql',
  privateKey: process.env.PRIVATE_KEY,
  forcBuildFlags: ['--release'],
});

// ABI FROM CONTRACT NOT INTERFACE