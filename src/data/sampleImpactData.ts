import { InvestmentReturn } from '../components/investment/ImpactMetrics';

/**
 * Sample impact-linked investment data for demonstration purposes
 */
export const sampleImpactInvestments: InvestmentReturn[] = [
  {
    id: 'inv-001',
    name: 'Sustainable Energy Fund',
    financialReturn: 12.4,
    impactScore: 87,
    combinedScore: 14.2,
    metrics: [
      {
        id: 'metric-001',
        name: 'Carbon Reduction',
        category: 'environmental',
        score: 92,
        weight: 0.3,
        description: 'Measures CO2 emissions avoided through renewable energy investments',
        trend: [85, 88, 90, 91, 92, 92]
      },
      {
        id: 'metric-002',
        name: 'Community Development',
        category: 'social',
        score: 78,
        weight: 0.25,
        description: 'Evaluates job creation and community benefits from projects',
        trend: [70, 72, 75, 76, 77, 78]
      },
      {
        id: 'metric-003',
        name: 'Shariah Compliance',
        category: 'ethical',
        score: 95,
        weight: 0.3,
        description: 'Measures adherence to Islamic finance principles',
        trend: [94, 94, 95, 95, 95, 95]
      },
      {
        id: 'metric-004',
        name: 'Governance Quality',
        category: 'governance',
        score: 82,
        weight: 0.15,
        description: 'Assesses transparency and ethical governance practices',
        trend: [75, 78, 80, 81, 82, 82]
      }
    ],
    historicalData: [
      { month: 'Jan', financialReturn: 10.2, impactScore: 82, combinedScore: 11.5 },
      { month: 'Feb', financialReturn: 10.8, impactScore: 83, combinedScore: 12.1 },
      { month: 'Mar', financialReturn: 11.5, impactScore: 84, combinedScore: 12.9 },
      { month: 'Apr', financialReturn: 11.9, impactScore: 85, combinedScore: 13.4 },
      { month: 'May', financialReturn: 12.2, impactScore: 86, combinedScore: 13.8 },
      { month: 'Jun', financialReturn: 12.4, impactScore: 87, combinedScore: 14.2 }
    ]
  },
  {
    id: 'inv-002',
    name: 'Ethical Tech Growth Fund',
    financialReturn: 15.8,
    impactScore: 72,
    combinedScore: 16.1,
    metrics: [
      {
        id: 'metric-005',
        name: 'Digital Inclusion',
        category: 'social',
        score: 85,
        weight: 0.25,
        description: 'Measures efforts to bridge the digital divide',
        trend: [78, 80, 82, 83, 84, 85]
      },
      {
        id: 'metric-006',
        name: 'Data Privacy',
        category: 'ethical',
        score: 79,
        weight: 0.3,
        description: 'Evaluates data protection and privacy practices',
        trend: [70, 72, 75, 77, 78, 79]
      },
      {
        id: 'metric-007',
        name: 'Shariah Compliance',
        category: 'ethical',
        score: 88,
        weight: 0.3,
        description: 'Measures adherence to Islamic finance principles',
        trend: [85, 86, 87, 87, 88, 88]
      },
      {
        id: 'metric-008',
        name: 'Board Diversity',
        category: 'governance',
        score: 65,
        weight: 0.15,
        description: 'Assesses diversity in leadership and decision-making',
        trend: [55, 58, 60, 62, 64, 65]
      }
    ],
    historicalData: [
      { month: 'Jan', financialReturn: 14.1, impactScore: 67, combinedScore: 14.0 },
      { month: 'Feb', financialReturn: 14.5, impactScore: 68, combinedScore: 14.5 },
      { month: 'Mar', financialReturn: 14.9, impactScore: 69, combinedScore: 15.0 },
      { month: 'Apr', financialReturn: 15.2, impactScore: 70, combinedScore: 15.4 },
      { month: 'May', financialReturn: 15.5, impactScore: 71, combinedScore: 15.7 },
      { month: 'Jun', financialReturn: 15.8, impactScore: 72, combinedScore: 16.1 }
    ]
  },
  {
    id: 'inv-003',
    name: 'Halal Healthcare Innovation Fund',
    financialReturn: 9.7,
    impactScore: 91,
    combinedScore: 12.3,
    metrics: [
      {
        id: 'metric-009',
        name: 'Healthcare Access',
        category: 'social',
        score: 94,
        weight: 0.35,
        description: 'Measures improvements in healthcare accessibility',
        trend: [88, 90, 91, 92, 93, 94]
      },
      {
        id: 'metric-010',
        name: 'Medical Ethics',
        category: 'ethical',
        score: 96,
        weight: 0.25,
        description: 'Evaluates adherence to ethical medical practices',
        trend: [92, 93, 94, 95, 95, 96]
      },
      {
        id: 'metric-011',
        name: 'Shariah Compliance',
        category: 'ethical',
        score: 97,
        weight: 0.25,
        description: 'Measures adherence to Islamic finance principles',
        trend: [95, 96, 96, 97, 97, 97]
      },
      {
        id: 'metric-012',
        name: 'Research Transparency',
        category: 'governance',
        score: 88,
        weight: 0.15,
        description: 'Assesses transparency in research and development',
        trend: [82, 84, 85, 86, 87, 88]
      }
    ],
    historicalData: [
      { month: 'Jan', financialReturn: 8.2, impactScore: 86, combinedScore: 10.1 },
      { month: 'Feb', financialReturn: 8.5, impactScore: 87, combinedScore: 10.5 },
      { month: 'Mar', financialReturn: 8.9, impactScore: 88, combinedScore: 10.9 },
      { month: 'Apr', financialReturn: 9.2, impactScore: 89, combinedScore: 11.3 },
      { month: 'May', financialReturn: 9.5, impactScore: 90, combinedScore: 11.8 },
      { month: 'Jun', financialReturn: 9.7, impactScore: 91, combinedScore: 12.3 }
    ]
  }
];

/**
 * Get a specific investment by ID
 */
export const getInvestmentById = (id: string): InvestmentReturn | undefined => {
  return sampleImpactInvestments.find(investment => investment.id === id);
};

/**
 * Get user's impact preference weights
 * In a real application, this would come from user settings
 */
export const getUserImpactPreferences = () => {
  return {
    financial: 0.6,
    impact: 0.4
  };
};
