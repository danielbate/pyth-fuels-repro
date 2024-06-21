contract;

use pyth_interface::{data_structures::price::{Price, PriceFeedId}, PythCore, PythInfo};

use std::{bytes::Bytes};

abi UpdatePrice {
    fn chain_id() -> u16;

    fn valid_time_period() -> u64;

    fn get_price(price_feed_id: PriceFeedId) -> Price;

    fn update_fee(update_data: Vec<Bytes>) -> u64;

    fn update_price_feeds(update_fee: u64, update_data: Vec<Bytes>);
}

const PYTH_CONTRACT_ID = 0xc8210e27604707c8647e8924cdb708fd056dcf5bbdcce156ee3b3db37106a2b6; // Testnet Contract
const FUEL_ETH_BASE_ASSET_ID = 0xf8f8b6283d7fa5b672b530cbb84fcccb4ff8dc40f8176ef4544ddb1f1952ad07;

impl UpdatePrice for Contract {
    fn chain_id() -> u16 {
        let x = abi(PythInfo, PYTH_CONTRACT_ID);
        let chain_id = x.chain_id();
        chain_id
    }

    fn valid_time_period() -> u64 {
        let x = abi(PythCore, PYTH_CONTRACT_ID);
        let valid_time_period = x.valid_time_period();
        valid_time_period
    }

    fn get_price(price_feed_id: PriceFeedId) -> Price {
        let x = abi(PythCore, PYTH_CONTRACT_ID);
        let price = x.price(price_feed_id);
        price
    }

    fn update_fee(update_data: Vec<Bytes>) -> u64 {
        let x = abi(PythCore, PYTH_CONTRACT_ID);
        let fee = x.update_fee(update_data);
        fee
    }

    fn update_price_feeds(update_fee: u64, update_data: Vec<Bytes>) {
        let x = abi(PythCore, PYTH_CONTRACT_ID);
        x.update_price_feeds {
            asset_id: FUEL_ETH_BASE_ASSET_ID, coins: update_fee
        }
        (update_data);
    }
}
