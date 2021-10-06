import React, { useContext, useState } from 'react';
import { ethers } from 'ethers';
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
} from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';
import { genPolygonscanUrl, TxObj } from '../utils/Poygonscan';
import { Message, createTypedDataV4 } from '../utils/TypedData';
import ForwarderAbi from '../abis/MinimalForwarder.json';
import HokusaiAbi from '../abis/ERC721WithRoyaltyMetaTx.json';

type FormValues = {
  apiKey: string;
  contractId: string;
  forwarderAddress: string;
  toAddress: string;
  tokenId: number;
  contractAddress: string;
};

function TransferForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { isConnected, provider } = useContext(WalletContext);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const baseUrl = process.env.REACT_APP_HOKUSAI_API_URL || undefined;

  if (!baseUrl) {
    throw new Error('Invalid REACT_APP_HOKUSAI_API_URL in .env');
  }

  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsLoading(true);
    setIsConfirmed(true);
    if (provider) {
      // Get signer from Metamask
      const signer = provider.getSigner();
      const from = await signer.getAddress();
      const { chainId } = await provider.getNetwork();

      // Setup contracts
      const forwarder = new ethers.Contract(
        values.forwarderAddress,
        ForwarderAbi.abi,
        provider
      );
      const hokusaiInterface = new ethers.utils.Interface(HokusaiAbi.abi);

      // Create tranferFrom data
      const data = hokusaiInterface.encodeFunctionData('transferFrom', [
        from,
        values.toAddress,
        values.tokenId,
      ]);

      // Create meta transaction message
      const message: Message = {
        from,
        to: values.contractAddress,
        value: 0,
        gas: 1e6,
        nonce: (await forwarder.getNonce(from)).toNumber(),
        data,
      };

      // Create typedDataV4
      const typedData = createTypedDataV4(
        chainId,
        values.forwarderAddress,
        message
      );

      // Sign typedData
      const signature = await provider.send('eth_signTypedData_v4', [
        from,
        JSON.stringify(typedData),
      ]);

      await fetch(
        `${baseUrl}/v1/nfts/${values.contractId}/transfer?key=${values.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request: { ...message, signature } }),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setResponse(genPolygonscanUrl(res as TxObj));
        })
        .catch((error) => console.log('error', error));
    }
    setIsLoading(false);
  });

  return isConfirmed ? (
    <>
      <Center>
        {isLoading && <Spinner />}
        <Link href={response}>{response}</Link>
      </Center>
    </>
  ) : (
    <>
      <Center>
        <Stack
          direction="column"
          spacing="10px"
          borderRadius="20px"
          p="30px"
          align="center"
        >
          <form onSubmit={onSubmit}>
            <FormControl id="apiKey" isInvalid={!!errors.apiKey} py={2}>
              <FormLabel>apiKey</FormLabel>
              <Input
                defaultValue={process.env.REACT_APP_HOKUSAI_API_KEY || ''}
                type="apiKey"
                {...register('apiKey', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl id="contractId" isInvalid={!!errors.contractId} py={2}>
              <FormLabel>contractId</FormLabel>
              <Input
                type="contractId"
                defaultValue={process.env.REACT_APP_CONTRACT_ID || ''}
                {...register('contractId', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl
              id="contractAddress"
              isInvalid={!!errors.contractAddress}
              py={2}
            >
              <FormLabel>contractAddress</FormLabel>
              <Input
                type="contractAddress"
                defaultValue={process.env.REACT_APP_CONTRACT_ADDRESS || ''}
                {...register('contractAddress', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>

            <FormControl
              id="forwarderAddress"
              isInvalid={!!errors.forwarderAddress}
              py={2}
            >
              <FormLabel>forwarderAddress</FormLabel>
              <Input
                type="forwarderAddress"
                defaultValue={process.env.REACT_APP_FORWARDER_ADDRESS || ''}
                {...register('forwarderAddress', { required: true })}
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
            <FormControl id="tokenId" isInvalid={!!errors.tokenId} py={2}>
              <FormLabel>tokenId</FormLabel>
              <Input
                type="tokenId"
                {...register('tokenId', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <Center>
              <Button p={4} type="submit" isDisabled={!isConnected}>
                Submit
              </Button>
            </Center>
          </form>
        </Stack>
      </Center>
    </>
  );
}

export default TransferForm;
