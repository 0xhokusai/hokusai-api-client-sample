import React, { useState } from 'react';
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
  Box,
  Image,
} from '@chakra-ui/react';
import { NFTStorage, toGatewayURL } from 'nft.storage';
import { useDropzone } from 'react-dropzone';

type FormValues = {
  name: string;
  description: string;
};

function MetadataForm(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
  });

  const endpoint = toGatewayURL('https://api.nft.storage');
  const token = import.meta.env.VITE_NFT_STORAGE_API_KEY || '';

  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsLoading(true);
    setIsConfirmed(true);
    const storage = new NFTStorage({ endpoint, token });
    {
      const metadata = await storage
        .store({
          name: values.name,
          description: values.description,
          image: acceptedFiles[0],
        })
        .catch((e) => {
          console.log(e);
          setError(e);
        });
      const url = new URL(metadata.url);
      setResponse(`https://dweb.link/ipfs/${url.hostname}${url.pathname}`);
    }
    setIsLoading(false);
  });

  const reset = () => {
    setError('');
    setIsConfirmed(false);
  };

  return isConfirmed ? (
    <>
      <Center>
        <Stack direction="column" align="center">
          {isLoading && <Spinner />}
          <Link isExternal href={response}>
            {response}
          </Link>
          {error && <Text>error</Text>}
          <Button onClick={() => reset()}>Back</Button>
        </Stack>
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
            <FormControl id="name" isInvalid={!!errors.name} py={2}>
              <FormLabel>Name</FormLabel>
              <Input type="name" {...register('name', { required: true })} />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormControl
              id="description"
              isInvalid={!!errors.description}
              py={2}
            >
              <FormLabel>Description</FormLabel>
              <Input
                type="description"
                {...register('description', { required: true })}
              />
              <FormErrorMessage>Fill this form.</FormErrorMessage>
            </FormControl>
            <FormLabel>Image</FormLabel>
            <Text pb={2} align="center">
              Drag & drop here, or click to upload
            </Text>
            <Box
              boxSize="xs"
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
              {...getRootProps({ className: 'dropzone' })}
            >
              {acceptedFiles[0] ? (
                <>
                  <Box>
                    <Image
                      objectFit="contain"
                      src={URL.createObjectURL(acceptedFiles[0])}
                    />
                    <input {...getInputProps()} />
                  </Box>
                </>
              ) : (
                <>
                  <input {...getInputProps()} />
                </>
              )}
            </Box>
            <Center p={4}>
              <Button p={4} type="submit">
                Submit
              </Button>
            </Center>
          </form>
        </Stack>
      </Center>
    </>
  );
}

export default MetadataForm;
