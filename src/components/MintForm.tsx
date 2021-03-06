import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Center,
  Stack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Spinner,
  Link,
  Text,
  Icon,
  Select,
  Heading,
} from '@chakra-ui/react';
import { AiOutlineRocket } from 'react-icons/ai';
import { BiWinkSmile } from 'react-icons/bi';
import { WalletContext } from '../context/WalletProvider';
import { genPolygonscanUrl, TxObj } from '../utils/Poygonscan';

type FormValues = {
  apiKey: string;
  contractId: string;
  toAddress: string;
  tokenUri: string;
  network: string;
};

function MintForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { isConnected, network } = useContext(WalletContext);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const baseUrl = 'api.hokusai.app';
  const version = '2'; // V2内でのヴァージョン

  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsLoading(true);
    setIsConfirmed(true);
    await fetch(
      `https://${baseUrl}/v2/${values.network}/nft/${version}/${values.contractId}/mint?key=${values.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          {
            to: values.toAddress,
            tokenURI: values.tokenUri,
          },
        ]),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setResponse(genPolygonscanUrl(res as TxObj, network));
      })
      .catch((e) => {
        console.log(e);
        setError(e);
      });
    setIsLoading(false);
  });

  const reset = () => {
    setError('');
    setIsConfirmed(false);
  };

  return isConfirmed ? (
    <>
      <Center>
        <Stack
          direction="column"
          spacing="10px"
          borderRadius="20px"
          p={8}
          mb={8}
          align="center"
          boxShadow="lg"
        >
          {isLoading && <Spinner />}
          {!isLoading && (
            <>
              <Icon as={BiWinkSmile} w={24} h={24} color="brand.100" />
              <Heading as="h1" size="2xl" color="brand.100">
                Congratulations!
              </Heading>
              <Heading as="h3" size="lg" pt={6}>
                Your NFT has successfully created.
              </Heading>
            </>
          )}
          <Link isExternal href={response} py={6}>
            {response}
          </Link>
          {error && <Text>error</Text>}
          <Button onClick={() => reset()}>Back</Button>
        </Stack>
      </Center>
    </>
  ) : (
    <>
      <Center pb={10}>
        <Stack
          direction="column"
          spacing="10px"
          borderRadius="20px"
          p={8}
          mb={8}
          align="center"
          shadow="lg"
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

            <FormControl id="toAddress" isInvalid={!!errors.toAddress} py={2}>
              <FormLabel>toAddress</FormLabel>
              <Input
                type="toAddress"
                {...register('toAddress', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl id="tokenUri" isInvalid={!!errors.tokenUri} py={2}>
              <FormLabel>Metadata URL(.json)</FormLabel>
              <Input
                type="tokenUri"
                {...register('tokenUri', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl id="network" isInvalid={!!errors.network} py={2}>
              <FormLabel>network</FormLabel>
              <Text fontSize="xs" color="brand.100">
                *Please select the network you chose when you applied for the
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
            <Center pt={6}>
              <Button
                p={4}
                type="submit"
                isDisabled={!isConnected}
                leftIcon={<Icon as={AiOutlineRocket} />}
                bg="brand.100"
                color="white"
              >
                Create NFT!
              </Button>
            </Center>
          </form>
        </Stack>
      </Center>
    </>
  );
}

export default MintForm;
