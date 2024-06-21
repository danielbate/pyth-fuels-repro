import { PythContractAbi__factory } from '@/pyth-crosschain-api';
import type { ContractAbi } from '@/sway-api';
import { ContractAbi__factory } from '@/sway-api';
import { FuelLogo } from "@/components/FuelLogo";
import { arrayify } from "fuels";
import { useState } from "react";
import { Link } from "@/components/Link";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import useAsync from "react-use/lib/useAsync";

// Hermes URL to Fetch Price
const hermesUrl = 'https://hermes.pyth.network/v2/updates/price/latest?ids[]=0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43';
// Pyth cross chain contract ID
const pythCrossChainContractId = '0xc8210e27604707c8647e8924cdb708fd056dcf5bbdcce156ee3b3db37106a2b6';
// Inter call contract ID
const contractId = '0x2707efe2695d63bea1329d32606cedc5e07394b0fa586b664476d6137a50f1de';
const hasContract = process.env.NEXT_PUBLIC_HAS_CONTRACT === "true";

export default function Home() {
  const { wallet, walletBalance, refreshWalletBalance } = useActiveWallet();
  const [contract, setContract] = useState<ContractAbi>();
  const [counter, setCounter] = useState<number>();

  useAsync(async () => {
    if (hasContract && wallet) {
      const testContract = ContractAbi__factory.connect(contractId, wallet);
      setContract(testContract);
    }
  }, [wallet]);

  const fetchPriceUpdateData = async () => {
    const response = await fetch(hermesUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch price");
    }
    const data = await response.json();
    const hex = '0x' + data.binary.data[0];
    return [arrayify(hex)];    
  };

  // eslint-disable-next-line consistent-return
  const getPrice = async () => {
    if(!wallet) {
      return toast.error("Wallet not loaded");
    }

    if (!contract) {
      return toast.error("Contract not loaded");
    }

    if (walletBalance?.eq(0)) {
      return toast.error(
        "Your wallet does not have enough funds. Please click the 'Top-up Wallet' button in the top right corner, or use the local faucet.",
      );
    }

    /**
     * Fetch price update data from Hermes
     */
    const updateData = await fetchPriceUpdateData();
    console.log('Update Data:', updateData);

    /**
     * Demonstrating that we can call update fee directly on the pyth contract
     */
    const pythContract = PythContractAbi__factory.connect(pythCrossChainContractId, wallet);
    const resOne = await pythContract.functions.update_fee(updateData).call();
    const fee = resOne.value;
    console.log('Update fee by calling the cross chain contract directly:', fee);

    // const resChain = await contract.functions.chain_id().addContracts([pythContract]).call();
    // console.log('Chain ID:', resChain.value);
    /**
     * Demonstrating we can call some functions from the inter call contract
     */
    const resTime = await contract.functions.valid_time_period().addContracts([pythContract]).call();
    console.log('Valid Time Period from the intercall contract:', resTime.value);

    /**
     * Demonstrating we can't call update fee from the inter call contract
     */
    console.log('Will now call update fee from the inter call contract:')
    const resFee = await contract.functions.update_fee(updateData).addContracts([pythContract]).call();
    const feeThree = resFee.value;
    console.log('Update fee from inter call:', feeThree);
    // const resFour = await contract.functions.update_price_feeds(fee, updateData)
    // .addContracts([pythContract])
    // .call();
    // console.log('Update Price Feeds:', resFour);
    await refreshWalletBalance?.();
  };

  return (
    <>
      <div className="flex gap-4 items-center">
        <FuelLogo />
        <h1 className="text-2xl font-semibold ali">Example</h1>
      </div>

      {hasContract && (
        <>
          <span data-testid="counter" className="text-gray-400 text-6xl">
            {counter}
          </span>

          <Button onClick={getPrice} className="mt-6">
            Fetch
          </Button>
        </>
      )}
    </>
  );
}
