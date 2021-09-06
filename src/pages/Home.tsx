import React from 'react';
import WalletConnect from '../components/WalletConnect';
import Form from '../components/Form';

function Home(): JSX.Element {
  return (
    <>
      <WalletConnect />
      <Form />
    </>
  );
}

export default Home;
