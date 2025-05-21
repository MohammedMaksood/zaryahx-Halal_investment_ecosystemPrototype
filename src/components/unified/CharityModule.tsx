import React from 'react';

interface Cause {
  id: string;
  name: string;
  organization: string;
  goal: number;
  raised: number;
  donors: number;
}

interface Donation {
  id: string;
  cause: string;
  amount: string;
  date: string;
  type: string;
}

interface CharityData {
  totalDonations: number;
  zakatDue: number;
  purificationAmount: number;
  featuredCauses: Cause[];
  recentDonations: Donation[];
}

interface CharityModuleProps {
  data: CharityData;
}

const CharityModule: React.FC<CharityModuleProps> = ({ data }) => {
  // Function to get badge background color
  const getBadgeColor = (type: string) => {
    if (type.toLowerCase() === 'zakat') return 'bg-green-400/20 text-green-400';
    if (type.toLowerCase() === 'sadaqah') return 'bg-blue-400/20 text-blue-400';
    if (type.toLowerCase() === 'waqf') return 'bg-purple-400/20 text-purple-400';
    return 'bg-lavender/20 text-lavender';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Charity Summary */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Charity Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/60">Total Donations</p>
              <p className="text-2xl font-bold text-white">${data.totalDonations.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Zakat Due</p>
              <p className="text-2xl font-bold text-lavender">${data.zakatDue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Purification Amount</p>
              <p className="text-2xl font-bold text-white">${data.purificationAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Charity Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-white/80">Calculate Zakat</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Calculate
              </button>
            </div>
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <span className="text-white/80">Purify Investments</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Purify
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Causes */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">Featured Causes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.featuredCauses.map((cause) => (
            <div key={cause.id} className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-1">{cause.name}</h3>
                <p className="text-sm text-white/60 mb-4">{cause.organization}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-white">${cause.raised.toLocaleString()} raised</span>
                    <span className="text-white/60">of ${cause.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2">
                    <div 
                      className="bg-lavender h-2 rounded-full" 
                      style={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-white/60 mt-1">
                    {cause.donors} donors
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-lavender text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-lavender/90 transition-colors">
                    Donate Now
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">Recent Donations</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Cause
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Receipt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.recentDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{donation.cause}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">{donation.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/60">{donation.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(donation.type)}`}>
                      {donation.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-lavender hover:text-lavender/80">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Community-Directed Impact */}
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-lavender/20">
        <div className="flex items-start mb-4">
          <div className="bg-lavender/20 p-3 rounded-lg inline-flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">Community-Directed Impact Portfolios</h2>
            <p className="text-white/70">
              Join forces with your community to create shared investment portfolios that address local challenges 
              and maximize collective impact.
            </p>
          </div>
        </div>
        <div className="bg-black/30 rounded-lg p-4 border border-white/10 mb-4">
          <h3 className="font-medium text-white mb-2">Your Community Portfolios</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Local Masjid Expansion</p>
                <p className="text-xs text-white/60">12 community members</p>
              </div>
              <span className="text-sm font-medium text-lavender">$5,400 raised</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">Youth Education Fund</p>
                <p className="text-xs text-white/60">28 community members</p>
              </div>
              <span className="text-sm font-medium text-lavender">$12,750 raised</span>
            </div>
          </div>
        </div>
        <button className="w-full bg-lavender text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-lavender/90 transition-colors">
          Create New Community Portfolio
        </button>
      </div>
    </div>
  );
};

export default CharityModule;
