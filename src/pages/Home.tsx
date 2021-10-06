import React from 'react';
import {
  Stack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react';

import WalletConnect from '../components/WalletConnect';
import TransferForm from '../components/TransferForm';
import MintForm from '../components/MintForm';

function Home(): JSX.Element {
  return (
    <>
      <Stack
        direction="column"
        spacing="10px"
        borderRadius="20px"
        p="30px"
        align="center"
      >
        <WalletConnect />
        <Tabs>
          <TabList>
            <Tab>Mint</Tab>
            <Tab>Transfer</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MintForm />
            </TabPanel>
            <TabPanel>
              <TransferForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </>
  );
}

export default Home;
