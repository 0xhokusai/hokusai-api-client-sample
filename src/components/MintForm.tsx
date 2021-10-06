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
} from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';

type FormValues = {
  apiKey: string;
  contractId: string;
  toAddress: string;
  tokenUri: string;
};

function MintForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { isConnected, address } = useContext(WalletContext);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const baseUrl = process.env.REACT_APP_HOKUSAI_API_URL || undefined;

  if (!baseUrl) {
    throw new Error('Invalid REACT_APP_HOKUSAI_API_URL in .env');
  }

  const onSubmit = handleSubmit(async (values: FormValues) => {
    fetch(`${baseUrl}/v1/nfts/${values.contractId}/mint?key=${values.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: values.toAddress,
        tokenUri: values.tokenUri,
      }),
    })
      .then((res) => res.text())
      .then((res) => setResponse(res))
      .catch((error) => console.log('error', error));

    setIsConfirmed(true);
  });

  return isConfirmed ? (
    <>
      <Center>{response}</Center>
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

            <FormControl id="toAddress" isInvalid={!!errors.toAddress} py={2}>
              <FormLabel>toAddress</FormLabel>
              <Input
                type="toAddress"
                defaultValue={address}
                {...register('toAddress', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl id="tokenUri" isInvalid={!!errors.tokenUri} py={2}>
              <FormLabel>tokenUri</FormLabel>
              <Input
                type="tokenUri"
                {...register('tokenUri', { required: true })}
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

export default MintForm;
