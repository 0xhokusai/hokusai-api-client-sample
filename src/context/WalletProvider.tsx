import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

// eslint-disable-next-line
declare let window: any;

type WalletType = 'Metamask' | undefined;

type Wallet = {
  address?: string;
  isConnected?: boolean;
  walletType: WalletType;
  connectMetamask(): Promise<void>;
};

async function connectWalletMetamask() {
  const provider = await window.ethereum
    .request({
      method: 'eth_requestAccounts',
      params: [{ eth_accounts: {} }],
    })
    .then(() => new ethers.providers.Web3Provider(window.ethereum))
    .catch((error: Error) => {
      console.log(error);
    });
  // Set Polygon network
  await window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x89',
        chainName: 'Matic',
        nativeCurrency: { name: 'Matic', symbol: 'MATIC', decimals: 18 },
        rpcUrls: ['https://rpc-mainnet.matic.network'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      },
    ],
  });
  return provider;
}
export const WalletContext = createContext<Wallet>({} as Wallet);

export const WalletProvider: React.FC = ({ children }) => {
  WalletProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [address, setAddress] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletType, setWalletType] = useState<WalletType>('Metamask');
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  const getAddress = async (p: ethers.providers.Web3Provider) => {
    const a = await p.getSigner().getAddress();
    setAddress(a);
    setIsConnected(true);
    return a;
  };

  const connectMetamask = async () => {
    await connectWalletMetamask()
      .then(async (p) => {
        setProvider(p);
        await getAddress(p);
        setWalletType('Metamask');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    connectMetamask();
    if (provider) {
      getAddress(provider);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        walletType,
        connectMetamask,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
