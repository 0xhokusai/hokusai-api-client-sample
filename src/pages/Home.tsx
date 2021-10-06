import React from 'react';
import { Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react';

import WalletConnect from '../components/WalletConnect';
import TransferForm from '../components/TransferForm';
import MintForm from '../components/MintForm';

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
            <MintForm />
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
