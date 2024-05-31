import { useState } from 'react';

const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = async (asyncFunction: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await asyncFunction();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, withLoading };
};

export default useLoading;
