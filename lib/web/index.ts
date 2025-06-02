import {
  IBroadcastResponse,
  IContractRequest,
  IProvider,
  ITransaction,
  ITxOptionsRequest,
} from "@klever/kleverweb/dist/types/dtos";
import { ErrLoadKleverWeb } from "../errors";
import utils from "../utils";

const isKleverWebLoaded = () => {
  return !!globalThis?.kleverWeb;
};

const isKleverWebActive = () => {
  return !!globalThis?.kleverWeb?.address;
};

const initialize = async ({
  timeout,
  accountChangeCallback,
}: {
  timeout: number;
  accountChangeCallback: CallableFunction;
}) => {
  if (!timeout) {
    timeout = 5000;
  }

  await utils.waitForKleverWeb(timeout);

  if (globalThis?.kleverHub !== undefined) {
    await globalThis?.kleverHub.initialize();

    globalThis?.kleverHub?.onAccountChanged(accountChangeCallback);
  } else {
    await globalThis?.kleverWeb?.initialize();
  }
};

const isKleverAccount = (address: string, chain: string | number): boolean => {
  if ((chain === "KLV" || chain === 1) && address.length === 62) return true;

  return false;
};

const getWalletAddress = (): string => {
  return globalThis?.kleverWeb?.getWalletAddress();
};

const getProvider = (): IProvider => {
  return globalThis?.kleverWeb?.getProvider();
};

const setProvider = (pvd: IProvider) => {
  globalThis?.kleverWeb?.setProvider(pvd);
  return;
};

const broadcastTransactions = async (
  transactions: ITransaction[]
): Promise<IBroadcastResponse> => {
  if (!isKleverWebActive()) {
    throw ErrLoadKleverWeb;
  }

  const response = await globalThis.kleverWeb.broadcastTransactions(
    transactions
  );

  return response;
};

const signMessage = async (message: string): Promise<string> => {
  if (!isKleverWebActive()) {
    throw ErrLoadKleverWeb;
  }

  const response = await globalThis?.kleverWeb?.signMessage(message);

  return response;
};

const signTransaction = async (tx: ITransaction): Promise<ITransaction> => {
  if (!isKleverWebActive()) {
    throw ErrLoadKleverWeb;
  }

  const response = await globalThis?.kleverWeb?.signTransaction(tx);

  return response;
};

const validateSignature = async (
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> => {
  if (!isKleverWebActive()) {
    throw ErrLoadKleverWeb;
  }

  const response = await globalThis?.kleverWeb?.validateSignature(
    message,
    signature,
    publicKey
  );

  return response;
};

const buildTransaction = async (
  contracts: IContractRequest[],
  txData?: string[],
  options?: ITxOptionsRequest
): Promise<ITransaction> => {
  if (!isKleverWebActive()) {
    throw ErrLoadKleverWeb;
  }

  return globalThis?.kleverWeb?.buildTransaction(contracts, txData, options);
};

const web = {
  isKleverWebLoaded,
  isKleverWebActive,
  broadcastTransactions,
  signMessage,
  signTransaction,
  validateSignature,
  buildTransaction,
  initialize,
  isKleverAccount,
  getWalletAddress,
  getProvider,
  setProvider,
};

export default web;
