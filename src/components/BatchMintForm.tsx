import React, { useState } from 'react';
import { List, ListItem, Stack, Textarea } from '@chakra-ui/react';
import MintDataCard, { MintData } from './MintDataCard';

function BatchMintForm(): JSX.Element {
  const [datasheet, setDatasheet] = useState('');
  const [mintDataList] = useState<MintData[]>([
    {
      to: '0x0000000000000000000000000000000000000000',
      tokenUri: 'https://example.com',
    },
    {
      to: '0x0000000000000000000000000000000000000000',
      tokenUri: 'https://example.com',
    },
  ]);

  const handleDatasheetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setDatasheet(e.target.value);

  return (
    <Stack align="center">
      <h1>BatchMint form</h1>
      <Textarea
        value={datasheet}
        onChange={handleDatasheetChange}
        placeholder="Paste datasheet (CSV)"
      />
      <List spacing={2}>
        {mintDataList.map((mintData) => (
          <ListItem>
            <MintDataCard {...mintData} />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

export default BatchMintForm;
