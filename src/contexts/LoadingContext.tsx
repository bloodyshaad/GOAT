import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
  withLoading: <T>(promise: Promise<T>, text?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const setLoading = (loading: boolean, text = 'Loading...') => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  const withLoading = async <T,>(promise: Promise<T>, text = 'Loading...'): Promise<T> => {
    setLoading(true, text);
    try {
      const result = await promise;
      return result;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, setLoading, withLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}