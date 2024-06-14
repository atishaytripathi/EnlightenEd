import { useState, useEffect } from 'react';

const useFetch = (url, isTrue) => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if(isTrue){
        setIsLoading(true);
        try {
            const response = await (await fetch(url)).json();
            if(response.status===200){
                setData(response);
            }
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            // const jsonData = await response.json();
        
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
      }
    };

    fetchData();

  }, []);

  return { data, isLoading, error };
};

export default useFetch;
