import { launchTestNode } from "fuels/test-utils";

import { describe, it, expect } from 'vitest';

import { PythContractAbi__factory, ContractAbi__factory } from "./src/contracts";
import crosschainBytecode from "./src/contracts/PythContractAbi.hex"
import contractBytecode from "./src/contracts/ContractAbi.hex"
import { arrayify } from "fuels";

describe("Contract tests", () => {

    const fetchPriceUpdateData = async () => {
        const response = await fetch('https://hermes.pyth.network/v2/updates/price/latest?ids[]=0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43');
        if (!response.ok) {
          throw new Error("Failed to fetch price");
        }
        const data = await response.json();
        const hex = '0x' + data.binary.data[0];
        return [arrayify(hex)];    
      };

    it('calls a contract', async () => {
        // Test node and wallet setup
        using launched = await launchTestNode();
        const { wallets: [wallet] } = launched;

        // Deploy the crosschain contract
        const crosschainContract = await PythContractAbi__factory.deployContract(crosschainBytecode, wallet);

        // Deploy the inter contract call contract
        const contract = await ContractAbi__factory.deployContract(contractBytecode, wallet, { configurableConstants: { 
            // Pass the crosschain contract address to the contract as configurable
            PYTH_CONTRACT_ID: crosschainContract.id.toB256()
        }});

        // Compare the time period of the crosschain contract and the contract
        const { value: crosschainTimeValue } = await crosschainContract.functions.valid_time_period().call();
        expect(crosschainTimeValue.toNumber()).toStrictEqual(0);

        const { value: contractTimeValue } = await contract.functions.valid_time_period().call();
        expect(contractTimeValue.toNumber()).toStrictEqual(0);

        expect(crosschainTimeValue).toStrictEqual(contractTimeValue);

        // Fetch price update data
        const priceData = await fetchPriceUpdateData();

        // Compare the update fee of the crosschain contract and the contract
        const { value: crosschainFeeValue } = await crosschainContract.functions.update_fee(priceData).call();
        expect(crosschainFeeValue.toNumber()).toStrictEqual(0);
        
        // Throws `The transaction reverted with an unknown reason: 123`
        const { value: contractFeeValue } = await contract.functions.update_fee(priceData).addContracts([crosschainContract]).call();
        expect(contractFeeValue.toNumber()).toStrictEqual(0);

        expect(crosschainFeeValue).toStrictEqual(contractFeeValue);
    });
});