import React from 'react';
import { ArrowForwardIcon, LinkIcon } from '@chakra-ui/icons';
import { Box, HStack, Link, VStack } from '@chakra-ui/react';

interface MintData {
  to: string;
  tokenUri: string;
}

type Props = MintData;

function MintDataCard({ to, tokenUri }: Props): JSX.Element {
  return (
    <Box p={4} borderWidth={1} borderRadius="lg">
      <HStack>
        <VStack align="end">
          <Box as="h4">
            To
            <ArrowForwardIcon />
          </Box>
          <Box>
            Token URI
            <LinkIcon />
          </Box>
        </VStack>
        <VStack align="start">
          <Box as="h4">{to}</Box>
          <Box as="h4">
            <Link href={tokenUri} isExternal>
              {tokenUri}
            </Link>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}

export default MintDataCard;
export type { MintData };
