import { useState, useEffect } from 'react';
import { getData } from '../services/dataService';

/**
 * A custom hook to fetch and synchronize data from localStorage.
 * It automatically updates the state when the 'portfolio-data-updated' event or the 'storage' event is fired.
 * 
 * @param {string} key The localStorage key to subscribe to.
 * @returns {any} The parsed data.
 */
export const usePortfolioData = (key) => {
  const [data, setData] = useState(() => getData(key));

  useEffect(() => {
    const handleStorageChange = (e) => {
      // If the event came from window.dispatchEvent (CustomEvent)
      if (e.type === 'portfolio-data-updated') {
        if (e.detail.key === key) {
          setData(getData(key));
        }
      } 
      // If the event came from another tab (StorageEvent)
      else if (e.type === 'storage') {
        if (e.key === key) {
          setData(getData(key));
        }
      }
    };

    window.addEventListener('portfolio-data-updated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('portfolio-data-updated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return data;
};
