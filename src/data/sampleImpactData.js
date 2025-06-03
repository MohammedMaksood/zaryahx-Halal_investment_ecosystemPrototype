/**
 * @typedef {Object} ImpactMetric
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {number} score
 * @property {number} weight
 * @property {string} description
 * @property {number[]} trend
 */

/**
 * @typedef {Object} HistoricalDataPoint
 * @property {string} date
 * @property {number} financialReturn
 * @property {number} impactScore
 * @property {number} combinedScore
 */

/**
 * @typedef {Object} InvestmentReturn
 * @property {string} id
 * @property {string} name
 * @property {number} financialReturn
 * @property {number} impactScore
 * @property {number} combinedScore
 * @property {ImpactMetric[]} metrics
 * @property {HistoricalDataPoint[]} historicalData
 */

/**
 * Sample impact-linked investment data for demonstration purposes
 * @type {InvestmentReturn[]}
 */
export const sampleImpactInvestments = [
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
      { date: '2023-01', financialReturn: 10.2, impactScore: 82, combinedScore: 11.8 },
      { date: '2023-02', financialReturn: 10.8, impactScore: 83, combinedScore: 12.3 },
      { date: '2023-03', financialReturn: 11.5, impactScore: 85, combinedScore: 13.0 },
      { date: '2023-04', financialReturn: 11.7, impactScore: 85, combinedScore: 13.2 },
      { date: '2023-05', financialReturn: 12.0, impactScore: 86, combinedScore: 13.6 },
      { date: '2023-06', financialReturn: 12.4, impactScore: 87, combinedScore: 14.2 }
    ]
  },
  {
    id: 'inv-002',
    name: 'Ethical Tech Growth',
    financialReturn: 15.8,
    impactScore: 79,
    combinedScore: 17.1,
    metrics: [
      {
        id: 'metric-005',
        name: 'Digital Inclusion',
        category: 'social',
        score: 85,
        weight: 0.25,
        description: 'Measures access to technology for underserved communities',
        trend: [78, 80, 82, 84, 85, 85]
      },
      {
        id: 'metric-006',
        name: 'Data Privacy',
        category: 'ethical',
        score: 88,
        weight: 0.3,
        description: 'Evaluates data protection and ethical use practices',
        trend: [82, 84, 85, 86, 87, 88]
      },
      {
        id: 'metric-007',
        name: 'Shariah Compliance',
        category: 'ethical',
        score: 90,
        weight: 0.3,
        description: 'Measures adherence to Islamic finance principles',
        trend: [88, 89, 89, 90, 90, 90]
      },
      {
        id: 'metric-008',
        name: 'Resource Efficiency',
        category: 'environmental',
        score: 72,
        weight: 0.15,
        description: 'Assesses energy and resource usage in operations',
        trend: [65, 67, 69, 70, 71, 72]
      }
    ],
    historicalData: [
      { date: '2023-01', financialReturn: 13.5, impactScore: 75, combinedScore: 14.6 },
      { date: '2023-02', financialReturn: 14.2, impactScore: 76, combinedScore: 15.3 },
      { date: '2023-03', financialReturn: 14.8, impactScore: 77, combinedScore: 15.9 },
      { date: '2023-04', financialReturn: 15.2, impactScore: 78, combinedScore: 16.4 },
      { date: '2023-05', financialReturn: 15.5, impactScore: 78, combinedScore: 16.7 },
      { date: '2023-06', financialReturn: 15.8, impactScore: 79, combinedScore: 17.1 }
    ]
  },
  {
    id: 'inv-003',
    name: 'Halal Agriculture Fund',
    financialReturn: 9.6,
    impactScore: 92,
    combinedScore: 11.8,
    metrics: [
      {
        id: 'metric-009',
        name: 'Food Security',
        category: 'social',
        score: 94,
        weight: 0.3,
        description: 'Measures contribution to sustainable food systems',
        trend: [90, 91, 92, 93, 94, 94]
      },
      {
        id: 'metric-010',
        name: 'Sustainable Practices',
        category: 'environmental',
        score: 88,
        weight: 0.25,
        description: 'Evaluates eco-friendly farming and production methods',
        trend: [82, 84, 85, 86, 87, 88]
      },
      {
        id: 'metric-011',
        name: 'Shariah Compliance',
        category: 'ethical',
        score: 98,
        weight: 0.3,
        description: 'Measures adherence to Islamic finance principles',
        trend: [97, 97, 98, 98, 98, 98]
      },
      {
        id: 'metric-012',
        name: 'Community Impact',
        category: 'social',
        score: 86,
        weight: 0.15,
        description: 'Assesses benefits to local farming communities',
        trend: [80, 82, 83, 84, 85, 86]
      }
    ],
    historicalData: [
      { date: '2023-01', financialReturn: 8.2, impactScore: 89, combinedScore: 10.0 },
      { date: '2023-02', financialReturn: 8.5, impactScore: 90, combinedScore: 10.4 },
      { date: '2023-03', financialReturn: 8.9, impactScore: 90, combinedScore: 10.8 },
      { date: '2023-04', financialReturn: 9.2, impactScore: 91, combinedScore: 11.2 },
      { date: '2023-05', financialReturn: 9.4, impactScore: 92, combinedScore: 11.5 },
      { date: '2023-06', financialReturn: 9.6, impactScore: 92, combinedScore: 11.8 }
    ]
  }
];
