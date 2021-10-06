export type TxObj = {
  txHash: string;
};

export function genPolygonscanUrl(txObj: TxObj) {
  const NETWORK = process.env.REACT_APP_NETWORK || undefined;

  if (!NETWORK) {
    throw new Error('Invalid REACT_APP_NETWORK in .env');
  }

  return NETWORK === 'polygon'
    ? `https://polygonscan.com/tx/${txObj.txHash}`
    : `https://mumbai.polygonscan.com/tx/${txObj.txHash}`;
}
