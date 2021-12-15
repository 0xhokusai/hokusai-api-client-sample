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
} from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';
import { genPolygonscanUrl, TxObj } from '../utils/Poygonscan';

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
  const { isConnected, network } = useContext(WalletContext);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const baseUrl =
    network === 'PolygonMainnet' ? 'polygon.hokusai.app' : 'mumbai.hokusai.app';

  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsLoading(true);
    setIsConfirmed(true);
    await fetch(
      `https://${baseUrl}/v1/nfts/${values.contractId}/mint?key=${values.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: values.toAddress,
          tokenUri: values.tokenUri,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setResponse(genPolygonscanUrl(res as TxObj));
      })
      .catch((error) => console.log(error));
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
