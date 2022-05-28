import React from 'react';
import Papa from 'papaparse';
import fileDownload from 'js-file-download';
import { Box, Button, Text } from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';

export interface Props {
  sampleJson: { fields: string[]; data: string[][] };
}

const CSVTemplate: React.FC<Props> = ({ sampleJson }) => {
  const handleDownload = () => {
    const sampleCsvData = Papa.unparse(sampleJson);
    const BOM = '\ufeff';
    const inBlob = new Blob([BOM + sampleCsvData], {
      type: 'text/csv;charset=utf-8',
    });
    const inFile = new File([inBlob], `batch_mint_sample.csv`, {
      type: 'text/csv',
    });
    fileDownload(inFile, `batch_mint_sample.csv`);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Text fontSize="sm">
        You can download a sample CSV file from the link below
      </Text>
      <Box m={1} />
      <Button
        onClick={handleDownload}
        variant="outline"
        color="brand.100"
        size="sm"
        leftIcon={<DownloadIcon height={15} width={15} />}
      >
        Download
      </Button>
    </Box>
  );
};

export default CSVTemplate;
