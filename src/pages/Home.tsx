import React from 'react';
import { Center, Stack } from '@chakra-ui/react';

import WalletConnect from '../components/WalletConnect';
import Form from '../components/Form';

function Home(): JSX.Element {
  return (
    <>
      <Center>
        <Stack
          direction="column"
          spacing="10px"
          borderRadius="20px"
          p="30px"
          align="center"
        >
          <WalletConnect />
          <Form />
        </Stack>
      </Center>
    </>
  );
}

export default Home;
