import {
  Flex,
  Heading,
  HStack,
  Tab,
  TabList,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import useHeader from './Hooks';

const Header: React.FC = () => {
  const { selectTab } = useHeader();

  return (
    <Flex as="header" top={0} width="full" shadow="sm" px={8} justify="center">
      {/* eslint-disable-next-line react/react-in-jsx-scope */}
      <VStack>
        <HStack py={8}>
          <Heading as="h1" size="2xl" mr={3}>
            Try
          </Heading>
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-t, #2A4D90, #4475AE)"
            bgClip="text"
          >
            Hokusai.
          </Heading>
        </HStack>

        <Tabs onChange={(index) => selectTab(index)} variant="enclosed">
          <TabList>
            <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Mint One</Tab>
            <Tab _selected={{ color: 'white', bg: 'brand.100' }}>
              Mint Multiple
            </Tab>
            <Tab _selected={{ color: 'white', bg: 'brand.100' }}>Transfer</Tab>
          </TabList>
        </Tabs>
      </VStack>
    </Flex>
  );
};

export default Header;
