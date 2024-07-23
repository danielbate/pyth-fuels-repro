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
const pythCrossChainContractId = '0x0a8767d6045f67a4749860852b0310eda4647da738db7a4039e4a176d66641d9';
// Inter call contract ID
const contractId = '0x82a6742f9868a287d7d6ad14ae89bb17b804f3389163bc72ec26f6ca8b52f172';
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
     * Instantiate the Pyth contract, we need this for the external ABI
     */
    const pythContract = PythContractAbi__factory.connect(pythCrossChainContractId, wallet);

    /**
     * Fetch the update fee
     */
    const { waitForResult: waitForResultUpdateFee } = await contract.functions.update_fee(updateData).addContracts([pythContract]).call();
    const { value: fee } = await waitForResultUpdateFee();
    console.log('Update fee:', fee);

    /**
     * Update the price feeds
     */
    const { waitForResult: waitForResultPriceFeed } = await contract.functions.update_price_feeds(fee, updateData).addContracts([pythContract]).call();
    const { value: updatePriceFeeds } = await waitForResultPriceFeed();
    console.log('Update price feeds:', updatePriceFeeds);
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
