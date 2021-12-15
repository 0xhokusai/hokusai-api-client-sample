import { Network } from '../context/WalletProvider';

export type TxObj = {
  txHash: string;
};

export function genPolygonscanUrl(txObj: TxObj, network: Network): string {
  return network === 'PolygonMainnet'
    ? `https://polygonscan.com/tx/${txObj.txHash}`
    : `https://mumbai.polygonscan.com/tx/${txObj.txHash}`;
}
