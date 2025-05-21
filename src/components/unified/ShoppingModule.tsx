import React from 'react';

interface Purchase {
  id: string;
  name: string;
  vendor: string;
  price: string;
  date: string;
  compliance: 'high' | 'medium' | 'low';
}

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  image: string;
}

interface ShoppingData {
  monthlySpending: number;
  complianceRate: number;
  savedProducts: number;
  recentPurchases: Purchase[];
  recommendedProducts: Product[];
}

interface ShoppingModuleProps {
  data: ShoppingData;
}

const ShoppingModule: React.FC<ShoppingModuleProps> = ({ data }) => {
  // Function to get compliance color
  const getComplianceColor = (compliance: string) => {
    if (compliance === 'high') return 'text-green-400';
    if (compliance === 'medium') return 'text-yellow-400';
    return 'text-red-400';
  };
  
  // Function to get badge background color
  const getBadgeColor = (compliance: string) => {
    if (compliance === 'high') return 'bg-green-400/20';
    if (compliance === 'medium') return 'bg-yellow-400/20';
    return 'bg-red-400/20';
  };

  // Function to render stars for ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {halfStar && (
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Shopping Summary */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Shopping Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/60">Monthly Spending</p>
              <p className="text-2xl font-bold text-white">${data.monthlySpending.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Compliance Rate</p>
              <p className="text-2xl font-bold text-lavender">{data.complianceRate}%</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Saved Products</p>
              <p className="text-2xl font-bold text-white">{data.savedProducts}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full md:w-1/2 bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-medium text-white mb-4">Shopping Actions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-white/80">Verify Product</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                Verify
              </button>
            </div>
            <div className="flex items-center justify-between bg-black/30 p-4 rounded-lg border border-white/5">
              <div className="flex items-center">
                <div className="bg-lavender/20 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <span className="text-white/80">View Shopping List</span>
              </div>
              <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
                View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-4">Recent Purchases</h2>
        <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-black/60">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Vendor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                  Compliance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {data.recentPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{purchase.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">{purchase.vendor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/80">{purchase.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white/60">{purchase.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getBadgeColor(purchase.compliance)} ${getComplianceColor(purchase.compliance)}`}>
                      {purchase.compliance.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Halal Products */}
      <div>
        <h2 className="text-xl font-medium text-white mb-4">Recommended Halal Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.recommendedProducts.map((product) => (
            <div key={product.id} className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-lavender font-medium mb-2">{product.price}</p>
                <div className="flex items-center mb-3">
                  {renderStars(product.rating)}
                  <span className="text-xs text-white/60 ml-2">({product.rating})</span>
                </div>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-lavender text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-lavender/90 transition-colors">
                    Add to Cart
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Powered Supply Chain Verification */}
      <div className="mt-8 bg-lavender/5 rounded-lg p-6 border border-lavender/20">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-lavender/20 flex items-center justify-center mr-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI-Powered Supply Chain Verification</h2>
            <p className="text-gray-600">
              Our advanced AI system analyzes entire supply chains to detect hidden non-compliant elements that traditional 
              verification methods might miss, ensuring your purchases are truly halal.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Supply Chain Verification Status</h3>
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              ACTIVE
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Your recent purchases have been verified through our AI-powered supply chain analysis. 
            96% of your purchases are from fully compliant supply chains.
          </p>
          <button className="text-lavender text-sm font-medium hover:underline">
            View Detailed Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingModule;
