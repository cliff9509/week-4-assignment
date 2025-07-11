import { useState, useCallback } from 'react';
import api from '../services/api'; // Assuming you create this service

const useApi = (
  apiCall, // The function from your api.js (e.g., api.getPosts)
  initialData = null,
  dependencies = [] // For useEffect, if you use this hook in useEffect
) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall(...args);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiCall, ...dependencies]
  );

  return { data, loading, error, fetchData, setData };
};

export default useApi;