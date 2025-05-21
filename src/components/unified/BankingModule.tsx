import React from 'react';

interface FinancialProduct {
  id: string;
  name: string;
  type: string;
  outstanding: number;
  monthlyPayment: number;
  termRemaining: string;
  compliance: 'full' | 'partial' | 'low';
}

interface BankingData {
  totalBalance: number;
  savingsBalance: number;
  currentBalance: number;
  financialProducts: FinancialProduct[];
}

interface BankingModuleProps {
  data: BankingData;
}

const BankingModule: React.FC<BankingModuleProps> = ({ data }) => {
  // Function to get compliance color
  const getComplianceColor = (compliance: string) => {
    if (compliance === 'full') return 'text-green-400';
    if (compliance === 'partial') return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Function to get badge background color
  const getBadgeColor = (compliance: string) => {
    if (compliance === 'full') return 'bg-green-400/20';
    if (compliance === 'partial') return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Account Summary */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Account Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/60">Total Balance</p>
              <p className="text-2xl font-bold text-white">${data.totalBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Savings Account</p>
              <p className="text-2xl font-bold text-lavender">${data.savingsBalance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Current Account</p>
              <p className="text-2xl font-bold text-white">${data.currentBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/80">Transfer Money</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Transfer
              </button>
            </div>
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="text-white/80">Pay Bills</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Pay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Products */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">Islamic Financial Products</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Outstanding
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Monthly Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Term Remaining
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Compliance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.financialProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{product.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">{product.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">${product.outstanding.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">${product.monthlyPayment.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/60">{product.termRemaining}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(product.compliance)} ${getComplianceColor(product.compliance)}`}>
                      {product.compliance.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Islamic Banking Services */}
      <div>
        <h2 className="text-xl font-medium text-white mb-4">Islamic Banking Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="bg-lavender/20 p-3 rounded-lg inline-flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Home Financing</h3>
            <p className="text-sm text-white/70 mb-4">
              Shariah-compliant home financing options using Diminishing Musharakah structure.
            </p>
            <button className="text-lavender text-sm font-medium hover:text-lavender/80 transition-colors">
              Learn More →
            </button>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="bg-lavender/20 p-3 rounded-lg inline-flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Savings Account</h3>
            <p className="text-sm text-white/70 mb-4">
              Profit-sharing savings accounts based on Mudarabah principles.
            </p>
            <button className="text-lavender text-sm font-medium hover:text-lavender/80 transition-colors">
              Learn More →
            </button>
          </div>
          <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="bg-lavender/20 p-3 rounded-lg inline-flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Business Financing</h3>
            <p className="text-sm text-white/70 mb-4">
              Shariah-compliant business financing using Murabaha and Ijarah structures.
            </p>
            <button className="text-lavender text-sm font-medium hover:text-lavender/80 transition-colors">
              Learn More →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankingModule;
