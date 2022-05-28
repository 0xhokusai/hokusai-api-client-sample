import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  Stack,
  Heading,
} from '@chakra-ui/react';

import TransferForm from '../components/TransferForm';
import MintForm from '../components/MintForm';
import MetadataForm from '../components/MetadataForm';
import BatchMintForm from '../components/BatchMint';
import Header from '../components/Header';
import MintFormV1 from '../components/MintFormV1';

function Home(): JSX.Element {
  return (
    <>
      <Header />
      <Tabs variant="enclosed" align="center">
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Mint (V2)</Tab>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>
            Batch Mint (V2)
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Transfer</Tab>
          <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Mint (V1)</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Stack direction="column" align="center">
              <Heading as="h2" py={6}>
                1. Create Metadata
              </Heading>
              <MetadataForm />
              <Heading as="h2" pt={10} pb={6}>
                2. Mint NFT
              </Heading>
              <MintForm />
            </Stack>
          </TabPanel>
          <TabPanel>
            <BatchMintForm />
          </TabPanel>
          <TabPanel>
            <TransferForm />
          </TabPanel>
          <TabPanel>
            <MintFormV1 />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Home;
