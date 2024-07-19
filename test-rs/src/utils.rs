use base64::{engine::general_purpose, Engine};
use fuels::{
    accounts::provider::Provider,
    crypto::SecretKey,
    prelude::{
        abigen, launch_custom_provider_and_get_wallets, Contract, ContractId, LoadConfiguration,
        StorageConfiguration, TxPolicies, WalletUnlocked, WalletsConfig,
    },
    programs::{call_response::FuelCallResponse, contract::CallParameters},
    types::{bech32::Bech32ContractId, Bits256, Bytes},
};
use std::{env, str::FromStr};

// Load abi from json
abigen!(Contract(
    name = "DemoContract",
    abi = "../demo-contract/out/release/demo-contract-abi.json"
));

const PYTH_CONTRACT_ID: &str = "c8210e27604707c8647e8924cdb708fd056dcf5bbdcce156ee3b3db37106a2b6";
const DEMO_CONTRACT_ID: &str = "8a96b57a9f1f2ecfac2cbab27fb9c23794f24dde1b13ae2e0d49fcf1cdd17b70";

pub mod update_price_abi_calls {

    use super::*;

    pub async fn chain_id(contract: &DemoContract<WalletUnlocked>) -> FuelCallResponse<u16> {
        contract
            .methods()
            .chain_id()
            .with_contract_ids(&[ContractId::from_str(PYTH_CONTRACT_ID).unwrap().into()])
            .call()
            .await
            .unwrap()
    }

    pub async fn valid_time_period(
        contract: &DemoContract<WalletUnlocked>,
    ) -> FuelCallResponse<u64> {
        contract
            .methods()
            .valid_time_period()
            .with_contract_ids(&[ContractId::from_str(PYTH_CONTRACT_ID).unwrap().into()])
            .call()
            .await
            .unwrap()
    }

    pub async fn get_price(
        contract: &DemoContract<WalletUnlocked>,
        price_feed_id: Bits256,
    ) -> FuelCallResponse<Price> {
        contract
            .methods()
            .get_price(price_feed_id)
            .with_contract_ids(&[ContractId::from_str(PYTH_CONTRACT_ID).unwrap().into()])
            .call()
            .await
            .unwrap()
    }

    pub async fn update_fee(
        contract: &DemoContract<WalletUnlocked>,
        update_data: Vec<Bytes>,
    ) -> FuelCallResponse<u64> {
        contract
            .methods()
            .update_fee(update_data)
            .with_contract_ids(&[ContractId::from_str(PYTH_CONTRACT_ID).unwrap().into()])
            .call()
            .await
            .unwrap()
    }

    pub async fn update_price_feeds(
        contract: &DemoContract<WalletUnlocked>,
        update_fee: u64,
        update_data: Vec<Bytes>,
    ) -> FuelCallResponse<()> {
        contract
            .methods()
            .update_price_feeds(update_fee, update_data)
            .with_contract_ids(&[ContractId::from_str(PYTH_CONTRACT_ID).unwrap().into()])
            .call_params(CallParameters::default().with_amount(update_fee))
            .unwrap()
            .call()
            .await
            .unwrap()
    }
}

pub async fn deploy_demo_contract() -> DemoContract<WalletUnlocked> {
    let provider = Provider::connect("testnet.fuel.network").await.unwrap();

    let secret = SecretKey::from_str(&env::var("PRIVATE_KEY").unwrap()).unwrap();

    // Create the wallet.
    let deployer_wallet = WalletUnlocked::new_from_private_key(secret, Some(provider));

    let contract_id = Contract::load_from(
        "../demo-contract/out/release/demo-contract.bin",
        LoadConfiguration::default(),
    )
    .unwrap()
    .deploy(&deployer_wallet, TxPolicies::default())
    .await
    .unwrap_or(ContractId::from_str(DEMO_CONTRACT_ID).unwrap().into());

    let demo_contract = DemoContract::new(contract_id, deployer_wallet.clone());

    demo_contract
}

pub const ETH_USD_PRICE_FEED_ID: &str =
    "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
pub const USDC_USD_PRICE_FEED_ID: &str =
    "eaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a";
pub const BTC_USD_PRICE_FEED_ID: &str =
    "e62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
pub const UNI_USD_PRICE_FEED_ID: &str =
    "0x78d185a741d07edb3412b09008b7c5cfb9bbbd7d568bf00ba737b456ba171501";

pub async fn update_data_bytes(
    price_feed_ids: Option<Vec<&str>>,
) -> Result<Vec<Bytes>, Box<dyn std::error::Error>> {
    let c = reqwest::Client::new();

    let price_feed_ids = price_feed_ids.unwrap_or_else(|| {
        vec![
            ETH_USD_PRICE_FEED_ID,
            // USDC_USD_PRICE_FEED_ID,
            // BTC_USD_PRICE_FEED_ID,
            // UNI_USD_PRICE_FEED_ID,
        ]
    });

    let mut ids_query_part = String::new();
    for (index, id) in price_feed_ids.iter().enumerate() {
        if index > 0 {
            ids_query_part.push('&');
        }
        ids_query_part.push_str(&format!("ids[]={}", id));
    }

    let req_url = format!(
        "https://hermes.pyth.network/api/latest_vaas?{}",
        ids_query_part
    );
    let body = c.get(&req_url).send().await?.text().await?;
    let response: Vec<&str> = serde_json::from_str(&body)?;

    let bytes_data: Vec<Bytes> = response
        .iter()
        .map(|data| {
            Bytes(
                general_purpose::STANDARD
                    .decode::<&str>(data)
                    .unwrap()
                    .to_owned(),
            )
        })
        .collect();

    Ok(bytes_data)
}