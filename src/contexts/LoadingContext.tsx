import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  showAdvisorLoading: boolean;
  setShowAdvisorLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [showAdvisorLoading, setShowAdvisorLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ showAdvisorLoading, setShowAdvisorLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
