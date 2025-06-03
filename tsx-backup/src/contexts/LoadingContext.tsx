import React, { createContext, useContext, useState, ReactNode } from 'react';

// Islamic Finance Advisor feature removed
interface LoadingContextType {
  // This context is kept for compatibility but functionality has been removed
  showAdvisorLoading: boolean;
  setShowAdvisorLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  // Islamic Finance Advisor feature removed - keeping state for compatibility
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
