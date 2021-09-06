import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { WalletProvider } from './context/WalletProvider';
import Home from './pages/Home';

function App(): JSX.Element {
  return (
    <WalletProvider>
      <ChakraProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </ChakraProvider>
    </WalletProvider>
  );
}

export default App;
