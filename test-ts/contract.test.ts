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
        const { waitForResult: initDeployWait } = await PythContractAbi__factory.deployContract(crosschainBytecode, wallet);
        const { contract: crosschainContract} = await initDeployWait();

        // Deploy the inter contract call contract
        const { waitForResult: deployWait } = await ContractAbi__factory.deployContract(contractBytecode, wallet, { configurableConstants: { 
            // Pass the crosschain contract address to the contract as configurable
            PYTH_CONTRACT_ID: crosschainContract.id.toB256()
        }});
        const { contract } = await deployWait();

        // Compare the time period of the crosschain contract and the contract
        const { waitForResult: crosschainTimeWait } = await crosschainContract.functions.valid_time_period().call();
        const { value: crosschainTimeValue } = await crosschainTimeWait();
        expect(crosschainTimeValue.toNumber()).toStrictEqual(0);

        const { waitForResult: contractTimeWait } = await contract.functions.valid_time_period().call();
        const { value: contractTimeValue } = await contractTimeWait();
        expect(contractTimeValue.toNumber()).toStrictEqual(0);

        expect(crosschainTimeValue).toStrictEqual(contractTimeValue);

        // Get the data sources of the crosschain contract
        const { waitForResult: crosschainValidDataSourcesWaitForResult }  = await crosschainContract.functions.valid_data_sources().call();
        const { value: crosschainValidDataSourcesValue } = await crosschainValidDataSourcesWaitForResult();
        console.log(crosschainValidDataSourcesValue);

        // Fetch price update data
        const priceData = await fetchPriceUpdateData();

        // Compare the update fee of the crosschain contract and the contract
        const { waitForResult: crosschainFeeWait } = await crosschainContract.functions.update_fee(priceData).call();
        const { value: crosschainFeeValue } = await crosschainFeeWait();
        expect(crosschainFeeValue.toNumber()).toStrictEqual(0);
        
        // Throws `The transaction reverted with an unknown reason: 123`
        const { waitForResult: contractFeeWait } = await contract.functions.update_fee(priceData).addContracts([crosschainContract]).call();
        const { value: contractFeeValue } = await contractFeeWait();
        expect(contractFeeValue.toNumber()).toStrictEqual(0);

        expect(crosschainFeeValue).toStrictEqual(contractFeeValue);
    });
});