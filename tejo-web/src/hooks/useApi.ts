import { useState, useCallback } from 'react';
import { ApiResponse } from '../types';

export interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onFinally?: () => void;
}

export function useApi<T = any>(options: UseApiOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    apiCall: () => Promise<ApiResponse<T> | T>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      // Handle both direct data and ApiResponse format
      if (response && typeof response === 'object' && 'success' in response) {
        const apiResponse = response as ApiResponse<T>;
        if (apiResponse.success && apiResponse.data) {
          setData(apiResponse.data);
          options.onSuccess?.(apiResponse.data);
        } else {
          const errorMessage = apiResponse.error || apiResponse.message || 'An error occurred';
          setError(errorMessage);
          options.onError?.(errorMessage);
        }
      } else {
        // Direct data response
        setData(response as T);
        options.onSuccess?.(response as T);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
      options.onFinally?.();
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    clearError,
  };
}

export function useApiMutation<T = any, P = any>(options: UseApiOptions<T> = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (
    apiCall: (params: P) => Promise<ApiResponse<T> | T>,
    params: P
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall(params);
      
      if (response && typeof response === 'object' && 'success' in response) {
        const apiResponse = response as ApiResponse<T>;
        if (apiResponse.success && apiResponse.data) {
          options.onSuccess?.(apiResponse.data);
        } else {
          const errorMessage = apiResponse.error || apiResponse.message || 'An error occurred';
          setError(errorMessage);
          options.onError?.(errorMessage);
        }
      } else {
        options.onSuccess?.(response as T);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setLoading(false);
      options.onFinally?.();
    }
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    mutate,
    clearError,
  };
}