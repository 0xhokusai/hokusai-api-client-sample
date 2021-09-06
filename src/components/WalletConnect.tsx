import React, { useContext } from 'react';
import { Button } from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';

function WalletConnect(): JSX.Element {
  const { connectMetamask, address } = useContext(WalletContext);

  return (
    <>
      <Button
        onClick={async () => {
          await connectMetamask();
        }}
      >
        {address
          ? `${address.slice(0, 6)}...${address.slice(-6)}`
          : 'Connect Wallet'}
      </Button>
    </>
  );
}

export default WalletConnect;
