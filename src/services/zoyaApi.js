// Zoya API service for Shariah compliance screening
// Documentation: https://docs.zoya.finance/

// Zoya API base URL
const ZOYA_API_BASE_URL = 'https://api.zoya.finance/graphql';

// Your Zoya API key - in a real app, store this in environment variables
const ZOYA_API_KEY = 'YOUR_ZOYA_API_KEY';

/**
 * @typedef {Object} ZoyaScreeningResult
 * @property {string} ticker
 * @property {string} name
 * @property {boolean} isCompliant
 * @property {number} complianceScore
 * @property {string} sector
 * @property {string} industry
 * @property {Object} financialRatios
 * @property {number} financialRatios.debtRatio
 * @property {number} financialRatios.interestIncome
 * @property {number} financialRatios.illiquidAssets
 * @property {number} financialRatios.haramRevenue
 * @property {string[]} [reasons]
 * @property {string} [description]
 */

/**
 * Get Shariah compliance screening for a stock by ticker or name
 * @param {string} query - The stock ticker or name to screen
 * @param {string} type - The type of query ('symbol' or 'name')
 * @returns {Promise<ZoyaScreeningResult>} The screening result
 */
export const getShariahCompliance = async (
  query,
  type = 'symbol'
) => {
  try {
    // In a real implementation, this would call the actual Zoya API
    // For now, we'll simulate the API response based on our existing logic
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Normalize query
    const normalizedQuery = query.toLowerCase();
    
    // List of known non-compliant companies
    const nonCompliantCompanies = [
      // Alcohol companies
      'diageo', 'anheuser', 'busch', 'heineken', 'constellation', 'molson', 'coors', 
      'brown-forman', 'pernod', 'carlsberg', 'boston beer', 'budweiser', 'corona',
      'bacardi', 'jack daniels', 'smirnoff', 'johnnie walker', 'absolut', 'hennessy',
      'guinness', 'stella artois', 'modelo', 'jameson', 'captain morgan', 'don julio',
      
      // Banking/Interest-based companies
      'jpmorgan', 'bank of america', 'citigroup', 'wells fargo', 'goldman sachs',
      'morgan stanley', 'hsbc', 'barclays', 'ubs', 'credit suisse', 'deutsche bank',
      'royal bank', 'santander', 'bnp paribas', 'amex', 'american express', 'visa', 
      'mastercard', 'discover', 'capital one', 'synchrony', 'ally financial',
      
      // Gambling companies
      'las vegas sands', 'mgm resorts', 'wynn resorts', 'caesars', 'penn national',
      'draftkings', 'flutter', 'entain', 'fanduel', 'betmgm', 'william hill', 'bet365',
      'pointsbet', 'bally', 'churchill downs', 'golden nugget', 'boyd gaming',
      
      // Tobacco companies
      'philip morris', 'altria', 'british american tobacco', 'imperial brands',
      'japan tobacco', 'swedish match', 'vector group', 'turning point brands',
      'universal corporation', 'marlboro', 'camel', 'newport', 'pall mall', 'juul',
      'vuse', 'blu', 'iqos', 'glo', 'ploom'
    ];
    
    // Check if the query matches any non-compliant companies
    const isNonCompliant = nonCompliantCompanies.some(company => 
      normalizedQuery.includes(company) || company.includes(normalizedQuery)
    );
    
    // Generate a mock response based on compliance check
    if (isNonCompliant) {
      return {
        ticker: query.toUpperCase(),
        name: `${query.charAt(0).toUpperCase()}${query.slice(1)} Inc.`,
        isCompliant: false,
        complianceScore: Math.floor(Math.random() * 40), // Random score between 0-39
        sector: 'Various',
        industry: 'Various',
        financialRatios: {
          debtRatio: 0.45 + Math.random() * 0.4, // 45-85%
          interestIncome: 0.15 + Math.random() * 0.2, // 15-35%
          illiquidAssets: 0.6 + Math.random() * 0.3, // 60-90%
          haramRevenue: 0.2 + Math.random() * 0.4 // 20-60%
        },
        reasons: [
          'Excessive debt ratio exceeds 33% threshold',
          'Interest income exceeds 5% threshold',
          'Core business activities involve prohibited industries',
          'Insufficient purification of impermissible income'
        ],
        description: `${query.charAt(0).toUpperCase()}${query.slice(1)} is involved in activities that are not permissible according to Shariah principles.`
      };
    } else {
      // For compliant companies
      return {
        ticker: query.toUpperCase(),
        name: `${query.charAt(0).toUpperCase()}${query.slice(1)} Inc.`,
        isCompliant: true,
        complianceScore: 60 + Math.floor(Math.random() * 40), // Random score between 60-99
        sector: 'Technology',
        industry: 'Software',
        financialRatios: {
          debtRatio: Math.random() * 0.33, // 0-33%
          interestIncome: Math.random() * 0.05, // 0-5%
          illiquidAssets: 0.4 + Math.random() * 0.3, // 40-70%
          haramRevenue: Math.random() * 0.05 // 0-5%
        },
        description: `${query.charAt(0).toUpperCase()}${query.slice(1)} meets the criteria for Shariah compliance based on financial ratios and business activities.`
      };
    }
  } catch (error) {
    console.error('Error fetching Shariah compliance data:', error);
    throw error;
  }
};

/**
 * Get a list of Shariah-compliant stocks
 * @param {Object} filters - Optional filters for the search
 * @param {string} [filters.sector] - Filter by sector
 * @param {string} [filters.industry] - Filter by industry
 * @param {number} [filters.minScore] - Minimum compliance score
 * @returns {Promise<ZoyaScreeningResult[]>} Array of compliant stocks
 */
export const getCompliantStocks = async (filters = {}) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data for compliant stocks
    const compliantStocks = [
      {
        ticker: 'AAPL',
        name: 'Apple Inc.',
        isCompliant: true,
        complianceScore: 85,
        sector: 'Technology',
        industry: 'Consumer Electronics',
        financialRatios: {
          debtRatio: 0.12,
          interestIncome: 0.02,
          illiquidAssets: 0.65,
          haramRevenue: 0.01
        }
      },
      {
        ticker: 'MSFT',
        name: 'Microsoft Corporation',
        isCompliant: true,
        complianceScore: 82,
        sector: 'Technology',
        industry: 'Software',
        financialRatios: {
          debtRatio: 0.15,
          interestIncome: 0.03,
          illiquidAssets: 0.58,
          haramRevenue: 0.02
        }
      },
      {
        ticker: 'GOOGL',
        name: 'Alphabet Inc.',
        isCompliant: true,
        complianceScore: 78,
        sector: 'Technology',
        industry: 'Internet Content & Information',
        financialRatios: {
          debtRatio: 0.06,
          interestIncome: 0.04,
          illiquidAssets: 0.62,
          haramRevenue: 0.03
        }
      }
    ];
    
    // Apply filters if provided
    let filteredStocks = [...compliantStocks];
    
    if (filters.sector) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.sector.toLowerCase() === filters.sector.toLowerCase()
      );
    }
    
    if (filters.industry) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.industry.toLowerCase().includes(filters.industry.toLowerCase())
      );
    }
    
    if (filters.minScore) {
      filteredStocks = filteredStocks.filter(stock => 
        stock.complianceScore >= filters.minScore
      );
    }
    
    return filteredStocks;
  } catch (error) {
    console.error('Error fetching compliant stocks:', error);
    throw error;
  }
};
