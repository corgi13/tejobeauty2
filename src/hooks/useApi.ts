import { useState, useEffect, useCallback } from 'react';
import { ApiResponse } from '../types';

export interface UseApiOptions {
  immediate?: boolean;
}

export interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseApiMutationOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export interface UseApiMutationReturn {
  mutate: (data?: any) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<T> = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (options.immediate !== false) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}

export function useApiMutation(
  url: string,
  options: UseApiMutationOptions = {}
): UseApiMutationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      options.onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    reset
  };
}

// Extended mutation hook with method support
export function useApiMutationWithMethod(
  url: string,
  options: UseApiMutationOptions & { method?: string } = {}
): UseApiMutationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      options.onSuccess?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url, options]);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    reset
  };
}