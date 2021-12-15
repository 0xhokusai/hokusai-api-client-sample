import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Stack,
  Text,
} from '@chakra-ui/react';

import WalletConnect from '../components/WalletConnect';
import TransferForm from '../components/TransferForm';
import MintForm from '../components/MintForm';
import MetadataForm from '../components/MetadataForm';

function Home(): JSX.Element {
  return (
    <>
      <WalletConnect />
      <Tabs>
        <TabList>
          <Tab>Mint</Tab>
          <Tab>Transfer</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack direction="column" align="center">
              <Text fontSize="lg">1. Create Metadata</Text>
              <MetadataForm />
              <Text fontSize="lg">2. Mint NFT</Text>
              <MintForm />
            </Stack>
          </TabPanel>
          <TabPanel>
            <TransferForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Home;
