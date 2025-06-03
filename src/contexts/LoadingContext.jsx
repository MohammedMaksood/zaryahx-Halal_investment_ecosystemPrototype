import React, { createContext, useContext, useState } from 'react';

// Islamic Finance Advisor feature removed


const LoadingContext = createContext(undefined);

export const LoadingProvider = ({ children }) => {
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
