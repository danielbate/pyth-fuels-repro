This example works with testnet and requires the fuel browser wallet extension.

![image info](./example.png)

Currently throws with the custom error `GuardianSetNotFound`

## Installation

1. `npm install`
1. `cp .env.example .env.local` and update the private key value
1. `npm run dev`

## Reproduction steps

1. Navigate to `http://localhost:3000`
1. Open the developer console
1. Press the fetch button in the middle of the screen

## Information

- The cross chain contact can be found at `pyth-crosschain`
- The inter contract call contract can be found at `sway-programs`
- The TS code that interacts with the contracts can be found at `src/pages/index.tsx`
