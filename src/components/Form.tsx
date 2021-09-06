import React, { useContext } from 'react';
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
} from '@chakra-ui/react';
import { WalletContext } from '../context/WalletProvider';
import { Message, createTypedData } from '../utils/TypedData';
import ForwarderAbi from '../abis/MinimalForwarder.json';
import HokusaiAbi from '../abis/ERC721WithRoyaltyMetaTx.json';

type FormValues = {
  apiKey: string;
  contractId: string;
  forwarderAddress: string;
  toAddress: string;
  tokenId: number;
};

function Form(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const { isConnected, provider } = useContext(WalletContext);

  const onSubmit = handleSubmit(async (values: FormValues) => {
    console.log(values);
    if (provider) {
      const signer = provider.getSigner();
      const from = await signer.getAddress();
      const { chainId } = await provider.getNetwork();

      const forwarder = new ethers.Contract(
        values.forwarderAddress,
        ForwarderAbi.abi,
        provider
      );

      const hokusaiInterface = new ethers.utils.Interface(HokusaiAbi.abi);

      const data = hokusaiInterface.encodeFunctionData('transferFrom', [
        from,
        values.toAddress,
        values.tokenId,
      ]);

      const message: Message = {
        from,
        to: values.toAddress,
        value: 0,
        gas: 1e6,
        nonce: (await forwarder.getNonce(from)).toNumber(),
        data,
      };

      const typedData = createTypedData(
        chainId,
        values.forwarderAddress,
        message
      );

      const signature = await provider.send('eth_signTypedData_v4', [
        from,
        JSON.stringify(typedData),
      ]);

      console.log(signature);
    }

    // ToDo: Post to API.
  });

  return (
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
                type="apiKey"
                {...register('apiKey', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl id="contractId" isInvalid={!!errors.contractId} py={2}>
              <FormLabel>contractId</FormLabel>
              <Input
                type="contractId"
                {...register('contractId', { required: true })}
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

export default Form;
