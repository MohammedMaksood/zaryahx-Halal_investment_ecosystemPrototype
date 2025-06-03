import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';





/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction ID
 * @property {number} amount - Transaction amount
 * @property {'purchase'|'deposit'|'withdrawal'|'transfer'} type - Transaction type
 * @property {'pending'|'completed'|'cancelled'} status - Transaction status
 * @property {number} timestamp - Transaction timestamp
 * @property {string} [description] - Optional transaction description
 */

/**
 * @typedef {Object} WalletContextType
 * @property {number} balance - Current wallet balance
 * @property {function(number): void} addFunds - Add funds to wallet
 * @property {function(number): boolean} withdrawFunds - Withdraw funds from wallet
 * @property {Transaction[]} pendingTransactions - List of pending transactions
 * @property {function(Object): string} addPendingTransaction - Add a pending transaction
 * @property {function(string): void} completePendingTransaction - Complete a pending transaction
 * @property {function(string): void} cancelPendingTransaction - Cancel a pending transaction
 */

const WalletContext = createContext(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};



export const WalletProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [balance, setBalance] = useState(10000); // Default starting balance of $10,000
  /** @type {[Transaction[], function(Transaction[]|function(Transaction[]): Transaction[]): void]} */
  const [pendingTransactions, setPendingTransactions] = useState([]);

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

  const addFunds = (amount) => {
    setBalance(prevBalance => prevBalance + amount);
  };

  const withdrawFunds = (amount)=> {
    if (amount <= 0) return false;
    if (balance < amount) return false;
    
    setBalance(prevBalance => prevBalance - amount);
    return true;
  };

  /**
   * Add a pending transaction
   * @param {Object} transaction - Transaction without id and timestamp
   * @param {number} transaction.amount - Transaction amount
   * @param {'purchase'|'deposit'|'withdrawal'|'transfer'} transaction.type - Transaction type
   * @param {'pending'|'completed'|'cancelled'} transaction.status - Transaction status
   * @param {string} [transaction.description] - Optional transaction description
   * @returns {string} Transaction ID
   */
  const addPendingTransaction = (transaction) => {
    const id = `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newTransaction= {
      ...transaction,
      id,
      timestamp: Date.now()
    };
    
    setPendingTransactions(prev => [...prev, newTransaction]);
    return id;
  };

  const completePendingTransaction = (id) => {
    setPendingTransactions(prev => 
      prev.map(txn => 
        txn.id === id ? { ...txn, status: 'completed' } : txn)
    );
  };

  const cancelPendingTransaction = (id) => {
    // Find the transaction
    const transaction = pendingTransactions.find(txn => txn.id === id);
    
    if (transaction && transaction.status === 'pending') {
      // If it's a purchase or withdrawal, refund the money
      if (transaction.type === 'purchase' || transaction.type === 'withdrawal') {
        setBalance(prevBalance => prevBalance + transaction.amount);
      }
      
      // Mark 
      setPendingTransactions(prev => 
        prev.map(txn => 
          txn.id === id ? { ...txn, status: 'cancelled' } : txn)
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
