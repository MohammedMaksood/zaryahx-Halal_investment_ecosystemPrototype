import React, { useState } from 'react';
import ImpactPortfolio from '../investment/ImpactPortfolio';

interface Holding {
  name: string;
  value: number;
  compliance: number;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  stock: string;
  amount: string;
  date: string;
  compliance: 'high' | 'medium' | 'low';
}

interface InvestmentData {
  portfolioValue: number;
  portfolioCompliance: number;
  purificationAmount: number;
  holdings: Holding[];
  recentTransactions: Transaction[];
}

interface InvestmentModuleProps {
  data: InvestmentData;
}

const InvestmentModule: React.FC<InvestmentModuleProps> = ({ data }) => {
  // Function to get compliance color
  const getComplianceColor = (compliance: number | string) => {
    if (typeof compliance === 'number') {
      if (compliance >= 95) return 'text-green-400';
      if (compliance >= 90) return 'text-green-400';
      if (compliance >= 85) return 'text-yellow-400';
      return 'text-red-400';
    } else {
      if (compliance === 'high') return 'text-green-400';
      if (compliance === 'medium') return 'text-yellow-400';
      return 'text-red-400';
    }
  };
  
  // Function to get badge background color
  const getBadgeColor = (compliance: number | string) => {
    if (typeof compliance === 'number') {
      if (compliance >= 90) return 'bg-green-400/20';
      if (compliance >= 85) return 'bg-yellow-400/20';
      return 'bg-red-400/20';
    } else {
      if (compliance === 'high') return 'bg-green-400/20';
      if (compliance === 'medium') return 'bg-yellow-400/20';
      return 'bg-red-400/20';
    }
  };
  
  // Function to get transaction type badge color
  const getTransactionTypeColor = (type: string) => {
    return type.toLowerCase() === 'buy' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Portfolio Summary */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Portfolio Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/60">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">${data.portfolioValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Compliance Score</p>
              <p className={`text-2xl font-bold ${getComplianceColor(data.portfolioCompliance)}`}>{data.portfolioCompliance}%</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Purification Due</p>
              <p className="text-2xl font-bold text-white">${data.purificationAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Shariah Compliance Actions */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Shariah Compliance Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-white/80">Calculate and donate impure gains</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Purify
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/80">Run deep compliance check</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">Holdings</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Compliance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.holdings.map((holding, index) => (
                <tr key={index} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{holding.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">${holding.value.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(holding.compliance)} ${getComplianceColor(holding.compliance)}`}>
                      {holding.compliance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-lavender hover:text-lavender/80 mr-3">Details</button>
                    <button className="text-lavender hover:text-lavender/80">Trade</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">Recent Transactions</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{transaction.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{transaction.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/80">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(transaction.compliance)} ${getComplianceColor(transaction.compliance)}`}>
                      {transaction.compliance.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Impact-Linked Investment Returns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-white">Impact-Linked Investment Returns</h2>
          <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
            View All Impact Metrics
          </button>
        </div>
        <ImpactPortfolio />
      </div>
    </div>
  );
};

export default InvestmentModule;
