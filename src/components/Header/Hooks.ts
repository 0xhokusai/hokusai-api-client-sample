import { useEffect, useState } from 'react';

const useHeader = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const selectTab = (index: number) => {
    setTabIndex(index);
  };

  useEffect(() => {
    console.log('tab chenged: ', tabIndex);
  }, [tabIndex]);

  return {
    selectTab,
    tabIndex,
  };
};

export default useHeader;
