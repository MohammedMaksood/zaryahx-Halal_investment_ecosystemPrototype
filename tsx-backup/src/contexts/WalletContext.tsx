import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => boolean; // Returns success status
  pendingTransactions: Transaction[];
  addPendingTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => string;
  completePendingTransaction: (id: string) => void;
  cancelPendingTransaction: (id: string) => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'sale';
  amount: number;
  details: string;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: number;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [balance, setBalance] = useState<number>(10000); // Default starting balance of $10,000
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);

  // Load wallet data from localStorage when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedBalance = localStorage.getItem(`wallet_balance_${user.id}`);
      const savedTransactions = localStorage.getItem(`wallet_transactions_${user.id}`);
      
      if (savedBalance) {
        setBalance(parseFloat(savedBalance));
      }
      
      if (savedTransactions) {
        setPendingTransactions(JSON.parse(savedTransactions));
      }
    }
  }, [isAuthenticated, user]);

  // Save wallet data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`wallet_balance_${user.id}`, balance.toString());
      localStorage.setItem(`wallet_transactions_${user.id}`, JSON.stringify(pendingTransactions));
    }
  }, [balance, pendingTransactions, isAuthenticated, user]);

  const addFunds = (amount: number) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  const withdrawFunds = (amount: number): boolean => {
    if (amount <= 0) return false;
    if (balance < amount) return false;
    
    setBalance(prevBalance => prevBalance - amount);
    return true;
  };

  const addPendingTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>): string => {
    const id = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      timestamp: Date.now()
    };
    
    setPendingTransactions(prev => [...prev, newTransaction]);
    return id;
  };

  const completePendingTransaction = (id: string) => {
    setPendingTransactions(prev => 
      prev.map(txn => 
        txn.id === id ? { ...txn, status: 'completed' } : txn
      )
    );
  };

  const cancelPendingTransaction = (id: string) => {
    // Find the transaction
    const transaction = pendingTransactions.find(txn => txn.id === id);
    
    if (transaction && transaction.status === 'pending') {
      // If it's a purchase or withdrawal, refund the money
      if (transaction.type === 'purchase' || transaction.type === 'withdrawal') {
        setBalance(prevBalance => prevBalance + transaction.amount);
      }
      
      // Mark as cancelled
      setPendingTransactions(prev => 
        prev.map(txn => 
          txn.id === id ? { ...txn, status: 'cancelled' } : txn
        )
      );
    }
  };

  const value = {
    balance,
    addFunds,
    withdrawFunds,
    pendingTransactions,
    addPendingTransaction,
    completePendingTransaction,
    cancelPendingTransaction
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
