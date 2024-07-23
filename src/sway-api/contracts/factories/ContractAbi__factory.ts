/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.92.1
  Forc version: 0.61.2
  Fuel-Core version: 0.31.0
*/

import { Interface, Contract, ContractFactory } from "fuels";
import type { Provider, Account, AbstractAddress, BytesLike, DeployContractOptions, StorageSlot, DeployContractResult } from "fuels";
import type { ContractAbi, ContractAbiInterface } from "../ContractAbi";

const _abi = {
  "encoding": "1",
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "raw untyped ptr",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "struct Bytes",
      "components": [
        {
          "name": "buf",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "len",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 5,
      "type": "struct Price",
      "components": [
        {
          "name": "confidence",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "exponent",
          "type": 10,
          "typeArguments": null
        },
        {
          "name": "price",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "publish_time",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "struct RawBytes",
      "components": [
        {
          "name": "ptr",
          "type": 3,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "struct RawVec",
      "components": [
        {
          "name": "ptr",
          "type": 3,
          "typeArguments": null
        },
        {
          "name": "cap",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        2
      ]
    },
    {
      "typeId": 8,
      "type": "struct Vec",
      "components": [
        {
          "name": "buf",
          "type": 7,
          "typeArguments": [
            {
              "name": "",
              "type": 2,
              "typeArguments": null
            }
          ]
        },
        {
          "name": "len",
          "type": 11,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        2
      ]
    },
    {
      "typeId": 9,
      "type": "u16",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 10,
      "type": "u32",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 11,
      "type": "u64",
      "components": null,
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [],
      "name": "chain_id",
      "output": {
        "name": "",
        "type": 9,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "price_feed_id",
          "type": 1,
          "typeArguments": null
        }
      ],
      "name": "get_price",
      "output": {
        "name": "",
        "type": 5,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "update_data",
          "type": 8,
          "typeArguments": [
            {
              "name": "",
              "type": 4,
              "typeArguments": null
            }
          ]
        }
      ],
      "name": "update_fee",
      "output": {
        "name": "",
        "type": 11,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [
        {
          "name": "update_fee",
          "type": 11,
          "typeArguments": null
        },
        {
          "name": "update_data",
          "type": 8,
          "typeArguments": [
            {
              "name": "",
              "type": 4,
              "typeArguments": null
            }
          ]
        }
      ],
      "name": "update_price_feeds",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      },
      "attributes": null
    },
    {
      "inputs": [],
      "name": "valid_time_period",
      "output": {
        "name": "",
        "type": 11,
        "typeArguments": null
      },
      "attributes": null
    }
  ],
  "loggedTypes": [],
  "messagesTypes": [],
  "configurables": [
    {
      "name": "PYTH_CONTRACT_ID",
      "configurableType": {
        "name": "",
        "type": 1,
        "typeArguments": null
      },
      "offset": 8904
    },
    {
      "name": "FUEL_ETH_BASE_ASSET_ID",
      "configurableType": {
        "name": "",
        "type": 1,
        "typeArguments": null
      },
      "offset": 8872
    }
  ]
};

const _storageSlots: StorageSlot[] = [];

export const ContractAbi__factory = {
  abi: _abi,

  storageSlots: _storageSlots,

  createInterface(): ContractAbiInterface {
    return new Interface(_abi) as unknown as ContractAbiInterface
  },

  connect(
    id: string | AbstractAddress,
    accountOrProvider: Account | Provider
  ): ContractAbi {
    return new Contract(id, _abi, accountOrProvider) as unknown as ContractAbi
  },

  async deployContract(
    bytecode: BytesLike,
    wallet: Account,
    options: DeployContractOptions = {}
  ): Promise<DeployContractResult<ContractAbi>> {
    const factory = new ContractFactory(bytecode, _abi, wallet);

    return factory.deployContract<ContractAbi>({
      storageSlots: _storageSlots,
      ...options,
    });
  },
}
