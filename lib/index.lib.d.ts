import { IProvider } from "@klever/kleverweb/dist/types/dtos";
import {
  IBroadcastResponse,
  IRawData,
  ISignatureResponse,
  ITransaction,
} from "./types/dtos";

declare global {
  var Go: any;
  var kleverWeb: kleverWeb;
  var kleverProviders: IProvider;
}

interface IKleverWeb {
  address: string;
  provider: IProvider;

  createAccount(): Promise<IPemResponse>;
  getAccount(address: string): Promise<IAccount>;

  parsePemFileData(pemData: string): Promise<IPemResponse>;
  setApiUrl(url: string): Promise<void>;
  setNodeUrl(url: string): Promise<void>;

  broadcastTransactions(payload: ITransaction[]): Promise<IBroadcastResponse>;
  signTransaction(payload: ITransaction): Promise<ISignatureResponse>;

  setWalletAddress(payload: string): Promise<void>;
  setPrivateKey(payload: string): Promise<void>;

  getWalletAddress(): string;
  getProvider(): IProvider;

  signMessage(payload: string): Promise<string>;
  validateSignature(payload: string): Promise<IVerifyResponse>;
  buildTransaction(
    contracts: IContractRequest[],
    txData?: string[],
    options?: ITxOptionsRequest
  ): Promise<ITransaction>;
}
