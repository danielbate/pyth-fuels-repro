Reproduction for the `The transaction reverted with an unknown reason: 123` error when inter calling a contract.

- The cross chain contact can be found at `pyth-crosschain`
- The inter contract call contract can be found at `sway-programs`

## TS Reproduction

1. `npm install`
1. `npm test`

## RS Reproduction

1. `cd test-rs`
1. `PRIVATE_KEY=<private_key_here> cargo test -- --nocapture`


