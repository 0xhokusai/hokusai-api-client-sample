import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Link,
  Select,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { AiOutlineRocket } from 'react-icons/ai';
import { FcStackOfPhotos, FcLike } from 'react-icons/fc';
import { MintData } from '../MintDataCard';
import sampleJson from './sample.json';
import CSVTemplate from './CSVTemplate';
import DropZone from './DropZone';
import { genPolygonscanUrl, TxObj } from '../../utils/Poygonscan';
import { WalletContext } from '../../context/WalletProvider';

type FormValues = {
  apiKey: string;
  contractId: string;
  toAddress: string;
  tokenUri: string;
  network: string;
};

function BatchMintForm(): JSX.Element {
  const { network } = useContext(WalletContext);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const [isPosting, setIsPosting] = useState(false);
  const [parsedCsvData, setParsedCsvData] = useState<MintData[] | null>(null);
  const [loadingFile, setLoadingFile] = useState(false);
  const [fileErrorMessage, setFileErrorMessage] = useState('');
  const baseUrl = 'api.hokusai.app';
  const [response, setResponse] = useState<string>('');
  const apiKeyValue = getValues('apiKey');
  const contractIdValue = getValues('contractId');
  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsPosting(true);

    await fetch(
      `https://${baseUrl}/v2/${values.network}/nft/2/${values.contractId}/mint?key=${values.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedCsvData),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setResponse(genPolygonscanUrl(res as TxObj, network));
      })
      .catch((e) => {
        console.log(e);
        setFileErrorMessage(fileErrorMessage);
      });
    setIsPosting(false);
  });

  const parseRawCsv = async (rawData: MintData[]): Promise<MintData[]> =>
    rawData;

  return (
    <Stack align="center">
      <Heading as="h1" size="3xl" p={12}>
        Mint More. Mint Faster.
      </Heading>
      <Heading as="h2" pb={4}>
        Features of Batch Mint
      </Heading>
      <HStack pb={4}>
        <VStack borderRadius="10px" p={8} maxW="xs">
          <Icon h={16} w={16} mb={4} as={FcStackOfPhotos} />
          <Heading as="p" size="md">
            Mint multiple
          </Heading>
          <Text color="brand.300">
            You can mint multiple NFTs at once with blazing fast speed.
          </Text>
        </VStack>
        <VStack borderRadius="10px" p={8} maxW="xs">
          <Icon h={16} w={16} mb={4} as={FcLike} />
          <Heading as="p" size="md">
            Cost-saving
          </Heading>
          <Text color="brand.300">
            If you mint two or more NFTs at once, you can get a discount.
          </Text>
        </VStack>
      </HStack>
      <Divider />

      <Heading as="h2" py={6}>
        1. Import your CSV file
      </Heading>
      <Box h={5} />
      <DropZone
        setLoadingFile={setLoadingFile}
        setFileErrorMessage={setFileErrorMessage}
        parsedCsvData={parsedCsvData}
        setParsedCsvData={setParsedCsvData}
        parseFunction={parseRawCsv}
      />
      <Box h={5} />
      <CSVTemplate sampleJson={sampleJson} />
      <Box h={5} />
      <Heading as="h2" py={6}>
        2. Mint NFT
      </Heading>
      <Stack
        direction="column"
        spacing="10px"
        borderRadius="20px"
        p={8}
        mb={8}
        align="center"
        boxShadow="lg"
      >
        <form onSubmit={onSubmit}>
          <FormControl id="apiKey" isInvalid={!!errors.apiKey} py={2}>
            <FormLabel>apiKey</FormLabel>
            <Input
              defaultValue={import.meta.env.VITE_HOKUSAI_API_KEY || ''}
              type="apiKey"
              {...register('apiKey', { required: true })}
            />
            <FormErrorMessage>Fill this form.</FormErrorMessage>
          </FormControl>
          <FormControl id="contractId" isInvalid={!!errors.contractId} py={2}>
            <FormLabel>contractId</FormLabel>
            <Input
              type="contractId"
              defaultValue={import.meta.env.VITE_CONTRACT_ID || ''}
              {...register('contractId', { required: true })}
            />
            <FormErrorMessage>Fill this form.</FormErrorMessage>
          </FormControl>
          <FormControl id="network" isInvalid={!!errors.network} py={2}>
            <FormLabel>network</FormLabel>
            <Text fontSize="xs" color="brand.100">
              *Please select the network you chose when you applied for the API
              API key
            </Text>
            <Select
              id="network"
              placeholder="Select network"
              type="network"
              {...register('network', { required: true })}
            >
              <option>polygon-mainnet</option>
              <option>polygon-mumbai</option>
              <option>ethereum-mainnet</option>
              <option>ethereum-rinkeby</option>
              <option>astar-astar</option>
              <option>astar-shiden</option>
              <option>astar-shibuya</option>
              <option>avalanche-mainnet</option>
              <option>avalanche-fuji</option>
              <option>binance-mainnet</option>
              <option>binance-testnet</option>
              <option>arbitrum-mainnet</option>
              <option>arbitrum-rinkeby</option>
            </Select>
            <FormErrorMessage>Select Network.</FormErrorMessage>
          </FormControl>
          <Center pt={4}>
            <Button
              p={4}
              type="submit"
              isLoading={isPosting}
              loadingText="Submitting"
              leftIcon={<Icon as={AiOutlineRocket} />}
              bg="brand.100"
              color="white"
              size="sm"
              disabled={
                loadingFile ||
                !parsedCsvData ||
                isPosting ||
                !apiKeyValue ||
                !contractIdValue
              }
              onClick={onSubmit}
            >
              Submit
            </Button>
          </Center>
        </form>
      </Stack>

      {response && (
        <Box
          backgroundColor="#fcfcfc"
          p={4}
          border="1px solid #eee"
          borderRadius={8}
        >
          <Link color="blue.500" isExternal href={response}>
            {response}
          </Link>
        </Box>
      )}
      <Box h={5} />
    </Stack>
  );
}

export default BatchMintForm;
