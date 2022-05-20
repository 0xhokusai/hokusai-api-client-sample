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

import TransferForm from '../components/TransferForm';
import MintForm from '../components/MintForm';
import MetadataForm from '../components/MetadataForm';
import BatchMintForm from '../components/BatchMint';
import Header from '../components/Header';

function Home(): JSX.Element {
  return (
    <>
      <Header />
      <Tabs variant="enclosed" align="center">
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Mint One</Tab>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>
            Mint Multiple
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Transfer</Tab>
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
            <BatchMintForm />
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
