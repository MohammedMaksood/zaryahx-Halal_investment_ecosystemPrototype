import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our unified data
interface InvestmentData {
  portfolioValue: number;
  portfolioCompliance: number;
  purificationAmount: number;
  holdings: Array<{
    name: string;
    value: number;
    compliance: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'buy' | 'sell';
    stock: string;
    amount: string;
    date: string;
    compliance: 'high' | 'medium' | 'low';
  }>;
  impactInvestments: Array<{
    id: string;
    name: string;
    financialReturn: number;
    impactScore: number;
    combinedScore: number;
  }>;
}

interface BankingData {
  totalBalance: number;
  savingsBalance: number;
  currentBalance: number;
  financialProducts: Array<{
    id: string;
    name: string;
    type: string;
    outstanding: number;
    monthlyPayment: number;
    termRemaining: string;
    compliance: 'full' | 'partial' | 'low';
  }>;
}

interface ShoppingData {
  monthlySpending: number;
  complianceRate: number;
  savedProducts: number;
  recentPurchases: Array<{
    id: string;
    name: string;
    vendor: string;
    price: string;
    date: string;
    compliance: 'high' | 'medium' | 'low';
  }>;
  recommendedProducts: Array<{
    id: string;
    name: string;
    price: string;
    rating: number;
    image: string;
  }>;
}

interface CharityData {
  totalDonations: number;
  zakatDue: number;
  purificationAmount: number;
  featuredCauses: Array<{
    id: string;
    name: string;
    organization: string;
    goal: number;
    raised: number;
    donors: number;
  }>;
  recentDonations: Array<{
    id: string;
    cause: string;
    amount: string;
    date: string;
    type: string;
  }>;
}

interface UnifiedData {
  overallCompliance: number;
  lifestyleBreakdown: {
    investments: number;
    banking: number;
    shopping: number;
    charity: number;
  };
  complianceTrend: Array<{
    month: string;
    score: number;
  }>;
  investments: InvestmentData;
  banking: BankingData;
  shopping: ShoppingData;
  charity: CharityData;
}

interface UnifiedDataContextType {
  unifiedData: UnifiedData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const UnifiedDataContext = createContext<UnifiedDataContextType | undefined>(undefined);

export const UnifiedDataProvider = ({ children }: { children: ReactNode }) => {
  const [unifiedData, setUnifiedData] = useState<UnifiedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all unified data
  const fetchUnifiedData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would be API calls to your backend
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: UnifiedData = {
        overallCompliance: 92,
        lifestyleBreakdown: {
          investments: 40,
          banking: 25,
          shopping: 20,
          charity: 15
        },
        complianceTrend: [
          { month: 'Jan', score: 85 },
          { month: 'Feb', score: 87 },
          { month: 'Mar', score: 89 },
          { month: 'Apr', score: 90 },
          { month: 'May', score: 91 },
          { month: 'Jun', score: 92 }
        ],
        investments: {
          portfolioValue: 7900,
          portfolioCompliance: 93,
          purificationAmount: 42.50,
          holdings: [
            { name: 'Al Rajhi Bank', value: 2500, compliance: 98 },
            { name: 'Apple Inc.', value: 1800, compliance: 92 },
            { name: 'Nestlé S.A.', value: 1200, compliance: 95 },
            { name: 'Tesla', value: 900, compliance: 88 },
            { name: 'Microsoft', value: 1500, compliance: 90 }
          ],
          recentTransactions: [
            { id: '1', type: 'buy', stock: 'Al Rajhi Bank', amount: '$500', date: '2025-05-15', compliance: 'high' },
            { id: '2', type: 'sell', stock: 'Microsoft', amount: '$300', date: '2025-05-10', compliance: 'medium' }
          ],
          impactInvestments: [
            { id: 'inv-001', name: 'Sustainable Energy Fund', financialReturn: 12.4, impactScore: 87, combinedScore: 14.2 },
            { id: 'inv-002', name: 'Ethical Tech Growth Fund', financialReturn: 15.8, impactScore: 72, combinedScore: 16.1 },
            { id: 'inv-003', name: 'Halal Healthcare Innovation Fund', financialReturn: 9.7, impactScore: 91, combinedScore: 12.3 }
          ]
        },
        banking: {
          totalBalance: 12450,
          savingsBalance: 8200,
          currentBalance: 4250,
          financialProducts: [
            { 
              id: '1', 
              name: 'Home Financing', 
              type: 'Diminishing Musharakah', 
              outstanding: 180000, 
              monthlyPayment: 1200, 
              termRemaining: '18 years', 
              compliance: 'full' 
            },
            { 
              id: '2', 
              name: 'Car Financing', 
              type: 'Ijarah (Lease)', 
              outstanding: 15000, 
              monthlyPayment: 450, 
              termRemaining: '3 years', 
              compliance: 'full' 
            }
          ]
        },
        shopping: {
          monthlySpending: 1250,
          complianceRate: 96,
          savedProducts: 24,
          recentPurchases: [
            { id: '1', name: 'Organic Halal Chicken', vendor: 'Farm Fresh', price: '$24.99', date: '2025-05-18', compliance: 'high' },
            { id: '2', name: 'Natural Honey', vendor: 'Pure Foods', price: '$12.50', date: '2025-05-15', compliance: 'high' },
            { id: '3', name: 'Cosmetics Set', vendor: 'Beauty Plus', price: '$45.00', date: '2025-05-10', compliance: 'medium' }
          ],
          recommendedProducts: [
            { id: '1', name: 'Premium Dates', price: '$18.99', rating: 4.8, image: 'https://placehold.co/100x100/9b87f5/FFFFFF/png?text=Dates' },
            { id: '2', name: 'Halal Beef Steaks', price: '$32.50', rating: 4.7, image: 'https://placehold.co/100x100/9b87f5/FFFFFF/png?text=Beef' },
            { id: '3', name: 'Alcohol-Free Perfume', price: '$28.00', rating: 4.5, image: 'https://placehold.co/100x100/9b87f5/FFFFFF/png?text=Perfume' }
          ]
        },
        charity: {
          totalDonations: 850,
          zakatDue: 320,
          purificationAmount: 42.50,
          featuredCauses: [
            { id: '1', name: 'Emergency Relief Fund', organization: 'Islamic Relief', goal: 50000, raised: 32500, donors: 450 },
            { id: '2', name: 'Orphan Sponsorship Program', organization: 'Muslim Aid', goal: 25000, raised: 18750, donors: 320 },
            { id: '3', name: 'Clean Water Initiative', organization: 'Charity Water', goal: 15000, raised: 9000, donors: 210 }
          ],
          recentDonations: [
            { id: '1', cause: 'Emergency Relief Fund', amount: '$100', date: '2025-05-10', type: 'Sadaqah' },
            { id: '2', cause: 'Masjid Construction', amount: '$250', date: '2025-04-25', type: 'Sadaqah Jariyah' },
            { id: '3', cause: 'Purification Payment', amount: '$42.50', date: '2025-04-15', type: 'Purification' }
          ]
        }
      };
      
      setUnifiedData(mockData);
    } catch (err) {
      setError('Failed to fetch unified data. Please try again.');
      console.error('Error fetching unified data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUnifiedData();
  }, []);

  // Function to refresh data
  const refreshData = async () => {
    await fetchUnifiedData();
  };

  return (
    <UnifiedDataContext.Provider value={{ unifiedData, loading, error, refreshData }}>
      {children}
    </UnifiedDataContext.Provider>
  );
};

// Custom hook to use the unified data context
export const useUnifiedData = () => {
  const context = useContext(UnifiedDataContext);
  if (context === undefined) {
    throw new Error('useUnifiedData must be used within a UnifiedDataProvider');
  }
  return context;
};
