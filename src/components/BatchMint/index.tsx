import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
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
  const baseUrl =
    network === 'PolygonMainnet' ? 'polygon.hokusai.app' : 'mumbai.hokusai.app';
  const networkParam =
    network === 'PolygonMainnet' ? 'polygon-mainnet' : 'polygon-mumbai';
  const [response, setResponse] = useState<string>('');
  const apiKeyValue = getValues('apiKey');
  const contractIdValue = getValues('contractId');
  const onSubmit = handleSubmit(async (values: FormValues) => {
    setIsPosting(true);

    await fetch(
      `https://${baseUrl}/v2/${networkParam}/nft/2/${values.contractId}/mint?key=${values.apiKey}`,
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
      <Text fontSize="lg">1. Import your CSV file</Text>
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
      <Text fontSize="lg">2. Fill in your apiKey and contractId</Text>
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
        <Box py={6} display="flex" justifyContent="center">
          <Button
            type="submit"
            isLoading={isPosting}
            loadingText="Submitting"
            colorScheme="blue"
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
        </Box>
      </form>
      <Link isExternal href={response}>
        {response}
      </Link>
    </Stack>
  );
}

export default BatchMintForm;
