import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { WalletProvider } from './context/WalletProvider';
import Home from './pages/Home';

const theme = extendTheme({
  colors: {
    brand: {
      100: '#2A4D90',
      200: '#4475AE',
      300: '#888888',
    },
  },
});

function App(): JSX.Element {
  return (
    <WalletProvider>
      <ChakraProvider theme={theme}>
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
