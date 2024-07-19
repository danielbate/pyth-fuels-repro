use fuels::types::Bytes;

use crate::utils::{
    deploy_demo_contract, update_data_bytes,
    update_price_abi_calls::{chain_id, update_fee, valid_time_period},
};

#[tokio::test]
async fn deploy_demo_and_call_methods() {
    let demo_contract = deploy_demo_contract().await;

    let chain_id = chain_id(&demo_contract).await;
    println!("chain_id: {}", chain_id.value);

    let valid_time_period = valid_time_period(&demo_contract).await;
    println!("valid_time_period: {}", valid_time_period.value);

    let update_data = update_data_bytes(None).await.unwrap();

    let update_fee = update_fee(&demo_contract, update_data).await;
    println!("update_fee: {}", update_fee.value);
}