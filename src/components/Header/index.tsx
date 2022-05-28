import { Flex, Heading, HStack } from '@chakra-ui/react';

const Header: React.FC = () => (
  <Flex as="header" top={0} width="full" px={8} justify="center">
    <HStack py={12}>
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
  </Flex>
);

export default Header;
