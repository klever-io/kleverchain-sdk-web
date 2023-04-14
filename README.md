## [![npm version](https://badge.fury.io/js/@klever%2Fsdk-web.svg)](https://badge.fury.io/js/@klever%2Fsdk-web)

# Kleverchain SDK library

The SDK module provides a quick and easy interface to make contract calls to the blockchain via the Klever wallet's injected methods.

For a more detailed and organized documentation, please visit the official [Kleverchain SDK Documentation](https://klever.gitbook.io/kleverchain-sdk/) website.

### Installation

```bash
$ npm install @klever/sdk-web
```

or

```bash
$ yarn add @klever/sdk-web
```

<br/>

# Basic usage

```ts
import { web, ITransfer, TransactionType } from "@klever/sdk-web";

const payload: ITransfer = {
  amount: 100 * 10 ** 6,
  receiver: "receiverAddress",
  kda: "KLV",
};

const unsignedTx = await web.buildTransaction([
  {
    payload,
    type: TransactionType.Transfer,
  },
]);

const signedTx = await web.signTransaction(unsignedTx);

const response = await web.broadcastTransactions([signedTx]);
```

<hr/>

<br/>

## Changing Network

The default network is the Kleverchain Mainnet, but if you want to use the Kleverchain Testnet or a local version of the Kleverchain, you can change the kleverWeb provider object by setting it before calling the initialize function.

```ts
import { web, IProvider } from '@klever/sdk-web';
...
  const provider:IProvider = {
      api: 'https://api.testnet.klever.finance',
      node: 'https://node.testnet.klever.finance'
  };

  window.kleverWeb.provider = provider;

  web.initialize();
...
```

## Transactions

All available transactions:

- `Transfer`
- `Freeze`
- `Unfreeze`
- `Delegate`
- `Undelegate`
- `Claim`
- `Withdraw`
- `CreateAsset`
- `AssetTrigger`
- `ConfigITO`
- `CreateMarketplace`
- `ConfigMarketplace`
- `Sell`
- `Buy`
- `CancelMarketOrder`
- `Proposal`
- `Vote`
- `CreateValidator`
- `ConfigValidator`
- `Unjail`
- `SetAccountName`
- `UpdateAccountPermission`
