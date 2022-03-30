/* eslint-disable no-nested-ternary */
import React, { useState, useCallback } from 'react';
import encoding, { Encoding } from 'encoding-japanese';
import { Box } from '@chakra-ui/react';
import Papa from 'papaparse';
import { FileRejection, useDropzone } from 'react-dropzone';
import { CopyIcon } from '@chakra-ui/icons';
import niceBytes from './niceBytes';
import { MintData } from '../MintDataCard';

const FIVE_MB = 5e6;

interface DropzoneProps {
  setLoadingFile: React.Dispatch<React.SetStateAction<boolean>>;
  setFileErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  parsedCsvData: MintData[] | null;
  setParsedCsvData: React.Dispatch<React.SetStateAction<MintData[] | null>>;
  parseFunction: (rawData: MintData[]) => Promise<MintData[]>;
  setSliceEnd?: number;
}

const DropZone: React.FC<DropzoneProps> = ({
  setLoadingFile,
  setFileErrorMessage,
  parsedCsvData,
  setParsedCsvData,
  parseFunction,
}) => {
  const [fileInfos, setFileInfos] = useState({ size: '', fileName: '' });

  const checkHeaderAndFirstRow = (file: File) => {
    setLoadingFile(true);
    Papa.parse(file, {
      delimiter: ',',
      header: true,
      skipEmptyLines: 'greedy',
      complete: async (results) => {
        const { data, errors: parseErrors } = results;
        if (parseErrors.length !== 0) {
          setLoadingFile(false);
          setFileErrorMessage(
            'Importing failed, Please check your file size and content'
          );
          return;
        }
        if (data.length === 0) {
          setFileErrorMessage('No data');
        }
        const parsedData = await parseFunction(data as MintData[]);
        setParsedCsvData(parsedData);
        setLoadingFile(false);
      },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length) {
        setFileErrorMessage('');
        setFileInfos({
          size: niceBytes(acceptedFiles[0].size),
          fileName: acceptedFiles[0].name,
        });
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = () => {
          // check encoding type and convert to unicode
          const contents = new Uint8Array(reader.result as ArrayBuffer);
          const encodingType = encoding.detect(contents);

          const unicodeArray = encoding.convert(contents, {
            to: 'UNICODE',
            from: encodingType as Encoding,
          });

          // take unicode array and turn back to file for parsing
          const unicodeString = encoding.codeToString(unicodeArray);
          const newFile = new File([unicodeString], `batch_mint.txt`, {
            type: 'text/plain',
          });

          checkHeaderAndFirstRow(newFile);
        };
        reader.readAsArrayBuffer(file);
      }
      if (fileRejections.length) {
        setFileErrorMessage(
          'Importing failed, Please check your file size and content'
        );
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: FIVE_MB,
    accept: '.csv',
    multiple: false,
  });

  return (
    <>
      <Box cursor="pointer" {...getRootProps()}>
        <input {...getInputProps()} />
        <Box
          p={5}
          border="4px"
          borderRadius={10}
          borderStyle="dashed"
          borderColor="gray.200"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          {!parsedCsvData && (
            <Box minWidth={500} display="flex" justifyContent="center" mb={2}>
              <CopyIcon w={8} h={8} color="gray.300" />
            </Box>
          )}
          {(() => {
            if (isDragActive) return <p>Drop your CSV file</p>;
            if (parsedCsvData) {
              return (
                <>
                  <p>{fileInfos.fileName}</p>
                  <p>File size: {fileInfos.size}</p>
                </>
              );
            }
            return (
              <>
                <p>Drag & drop here, or click to upload</p>
                <p>(File maximum size: 5MB)</p>
              </>
            );
          })()}
        </Box>
      </Box>
    </>
  );
};

export default DropZone;

DropZone.defaultProps = {
  setSliceEnd: undefined,
};
