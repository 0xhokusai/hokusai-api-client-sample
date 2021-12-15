import React, { useContext } from 'react';
import { Button, HStack, VStack, Text } from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';

function WalletConnect(): JSX.Element {
  const { changeNetowrk, address, network } = useContext(WalletContext);

  return (
    <>
      <VStack p={4}>
        <Text>Current Network: {network}</Text>
        <Text>Your Address: {address}</Text>
        <HStack>
          <Button
            onClick={async () => {
              await changeNetowrk('PolygonMumbai');
            }}
          >
            Connect Mumbai
          </Button>
          <Button
            onClick={async () => {
              await changeNetowrk('PolygonMainnet');
            }}
          >
            Connect Mainnet
          </Button>
        </HStack>
      </VStack>
    </>
  );
}

export default WalletConnect;
