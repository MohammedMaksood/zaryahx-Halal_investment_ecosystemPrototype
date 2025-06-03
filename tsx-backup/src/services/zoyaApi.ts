// Zoya API service for Shariah compliance screening
// Documentation: https://docs.zoya.finance/



// Zoya API base URL
const ZOYA_API_BASE_URL = 'https://api.zoya.finance/graphql';

// Your Zoya API key - in a real app, store this in environment variables
const ZOYA_API_KEY = 'YOUR_ZOYA_API_KEY';

// Interface for Zoya API response
export interface ZoyaScreeningResult {
  ticker: string;
  name: string;
  isCompliant: boolean;
  complianceScore: number;
  sector: string;
  industry: string;
  financialRatios: {
    debtRatio: number;
    interestIncome: number;
    illiquidAssets: number;
    haramRevenue: number;
  };
  reasons?: string[];
  description?: string;
}

// Get Shariah compliance screening for a stock by ticker or name
export const getShariahCompliance = async (
  query: string,
  type: 'symbol' | 'name' = 'symbol'
): Promise<ZoyaScreeningResult> => {
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
      'grey goose', 'moet', 'chandon', 'dom perignon', 'tsingtao', 'asahi', 'kirin',
      'sapporo', 'beer', 'wine', 'liquor', 'spirits', 'brewery', 'distillery', 'winery',
      'alcohol', 'vodka', 'whiskey', 'rum', 'tequila', 'gin', 'brandy', 'cognac',
      
      // Tobacco companies
      'altria', 'philip morris', 'british american tobacco', 'imperial brands', 
      'japan tobacco', 'marlboro', 'newport', 'camel', 'tobacco', 'cigarette', 
      'smoking', 'vape', 'cigar', 'nicotine', 'itc', 'indian tobacco', 'godfrey phillips',
      'vst industries', 'golden tobacco', 'npi', 'national tobacco', 'universal corporation',
      'turning point brands', 'vector group', 'swedish match', 'eastern tobacco', 'gudang garam',
      'hm sampoerna', 'kt&g', 'iqos', 'juul', 'pall mall', 'winston', 'lucky strike', 'dunhill',
      'kent', 'kool', 'benson & hedges', 'rothmans', 'parliament', 'chesterfield', 'l&m',
      'djarum', 'nat sherman', 'american spirit', 'davidoff', 'virginia slims',
      'e-cigarette', 'vaping', 'hookah', 'shisha', 'snuff', 'snus', 'chewing tobacco',
      'rolling tobacco', 'pipe tobacco', 'bidis', 'kretek',
      
      // Gambling companies
      'las vegas sands', 'mgm resorts', 'wynn', 'caesars', 'flutter', 'draftkings',
      'penn', 'boyd', 'gambling', 'casino', 'betting', 'lottery', 'poker', 'slots',
      
      // Banking companies
      'jpmorgan', 'chase', 'bank of america', 'wells fargo', 'citigroup', 'goldman sachs',
      'morgan stanley', 'hsbc', 'barclays', 'deutsche bank', 'ubs', 'conventional bank',
      'interest', 'riba', 'mortgage', 'loan', 'lending',
      
      // Other non-compliant industries
      'pork', 'pig', 'swine', 'bacon', 'ham', 'weapon', 'defense', 'missile', 'gun',
      'adult entertainment', 'pornography'
    ];
    
    // Define specific company overrides for more accurate screening
    const companyOverrides: Record<string, { isCompliant: boolean, industry: string, reason?: string }> = {
      'itc': { 
        isCompliant: false, 
        industry: 'Tobacco', 
        reason: 'Primary business includes tobacco products which are prohibited in Islam'
      },
      'diageo': { 
        isCompliant: false, 
        industry: 'Alcoholic Beverages',
        reason: 'Primary business is alcoholic beverages which are prohibited in Islam'
      },
      'mgm': { 
        isCompliant: false, 
        industry: 'Gambling',
        reason: 'Primary business includes gambling which is prohibited in Islam'
      },
      'jpmorgan': { 
        isCompliant: false, 
        industry: 'Conventional Banking',
        reason: 'Conventional banking involves interest (riba) which is prohibited in Islam'
      },
      'british american tobacco': { 
        isCompliant: false, 
        industry: 'Tobacco',
        reason: 'Primary business is tobacco products which are prohibited in Islam'
      }
    };
    
    // Check if we have a specific override for this company
    const override = Object.entries(companyOverrides).find(([key]) => 
      normalizedQuery.includes(key) || key.includes(normalizedQuery)
    );
    
    // If we have an override, use it; otherwise check against the non-compliant list
    const isNonCompliant = override ? override[1].isCompliant === false : nonCompliantCompanies.some(company => 
      normalizedQuery.includes(company) || company.includes(normalizedQuery)
    );
    
    // Get the industry from the override if available
    let overrideIndustry = override ? override[1].industry : null;
    let overrideReason = override ? override[1].reason : null;
    
    // Determine industry based on query (use override if available)
    let industry = overrideIndustry || 'Technology'; // Default to Technology if no override
    
    // Only determine industry from query if no override exists
    if (!overrideIndustry) {
      if (/alcohol|beer|wine|liquor|spirits|brewery|distillery|winery|vodka|whiskey|rum|tequila|gin|brandy|cognac/.test(normalizedQuery)) {
        industry = 'Alcoholic Beverages';
      } else if (/tobacco|cigarette|smoking|vape|cigar|nicotine|marlboro|newport|camel/.test(normalizedQuery)) {
        industry = 'Tobacco';
      } else if (/gambling|casino|betting|lottery|poker|slots/.test(normalizedQuery)) {
        industry = 'Gambling';
      } else if (/bank|interest|riba|mortgage|loan|lending/.test(normalizedQuery)) {
        industry = 'Conventional Banking';
      } else if (/pork|pig|swine|bacon|ham/.test(normalizedQuery)) {
        industry = 'Pork Processing';
      } else if (/weapon|defense|missile|gun|firearm|ammunition|military|arms/.test(normalizedQuery)) {
        industry = 'Weapons Manufacturing';
      } else if (/adult|entertainment|pornography/.test(normalizedQuery)) {
        industry = 'Adult Entertainment';
      } else if (/apple|msft|microsoft|googl|google|tech|software|hardware/.test(normalizedQuery)) {
        industry = 'Technology';
      } else if (/healthcare|medical|pharma|biotech|drug/.test(normalizedQuery)) {
        industry = 'Healthcare';
      } else if (/retail|consumer|goods/.test(normalizedQuery)) {
        industry = 'Consumer Goods';
      }
    }
    
    // Generate appropriate financial ratios based on compliance
    const financialRatios = isNonCompliant 
      ? {
          debtRatio: Math.random() * 30 + 40, // Above 33% (non-compliant)
          interestIncome: Math.random() * 10 + 5, // Above 5% (non-compliant)
          illiquidAssets: Math.random() * 20 + 30, // Below 51% (non-compliant)
          haramRevenue: Math.random() * 30 + 10, // Above 5% (non-compliant)
        }
      : {
          debtRatio: Math.random() * 20 + 5, // Below 33% (compliant)
          interestIncome: Math.random() * 3 + 1, // Below 5% (compliant)
          illiquidAssets: Math.random() * 20 + 60, // Above 51% (compliant)
          haramRevenue: Math.random() * 3 + 0.5, // Below 5% (compliant)
        };
    
    // Generate compliance score
    const complianceScore = isNonCompliant 
      ? Math.floor(Math.random() * 25 + 5) // Very low score for non-compliant
      : Math.floor(Math.random() * 15 + 75); // High score for compliant
    
    // Generate reasons for compliance/non-compliance
    const reasons = isNonCompliant 
      ? [
          // If we have an override reason, use it as the first reason
          ...(overrideReason ? [overrideReason] : []),
          `Debt-to-asset ratio is ${financialRatios.debtRatio.toFixed(2)}% (exceeds 33% threshold)`,
          `Interest income is ${financialRatios.interestIncome.toFixed(2)}% of revenue (exceeds 5% threshold)`,
          `Illiquid assets ratio is ${financialRatios.illiquidAssets.toFixed(2)}% (below 51% threshold)`,
          `Non-permissible income is ${financialRatios.haramRevenue.toFixed(2)}% (exceeds 5% threshold)`,
          "Business activities include impermissible elements"
        ]
      : [
          `Debt-to-asset ratio is ${financialRatios.debtRatio.toFixed(2)}% (below 33% threshold)`,
          `Interest income is ${financialRatios.interestIncome.toFixed(2)}% of revenue (below 5% threshold)`,
          `Illiquid assets ratio is ${financialRatios.illiquidAssets.toFixed(2)}% (above 51% threshold)`,
          `Non-permissible income is ${financialRatios.haramRevenue.toFixed(2)}% (below 5% threshold)`,
          "Business activities align with Shariah principles"
        ];
    
    // Generate description
    const description = isNonCompliant
      ? `This company does not meet Shariah compliance requirements due to its involvement in ${industry.toLowerCase()}, which is prohibited under Islamic principles. The company's primary business activities involve products or services that are considered haram.`
      : 'This company passes Shariah screening criteria based on its financial metrics and business activities. The debt ratio, interest income, and involvement in prohibited activities are all within acceptable limits.';
    
    // Format company name based on query
    let name = query;
    if (type === 'symbol') {
      if (query.toUpperCase() === 'AAPL') name = 'Apple Inc.';
      else if (query.toUpperCase() === 'MSFT') name = 'Microsoft Corporation';
      else if (query.toUpperCase() === 'GOOGL') name = 'Alphabet Inc.';
      else if (query.toUpperCase() === 'DEO') name = 'Diageo plc';
      else if (query.toUpperCase() === 'BUD') name = 'Anheuser-Busch InBev';
      else if (query.toUpperCase() === 'HEINY') name = 'Heineken N.V.';
      else if (query.toUpperCase() === 'ITC') name = 'ITC Limited (Indian Tobacco Company)';
      else if (query.toUpperCase() === 'BTI') name = 'British American Tobacco';
      else if (query.toUpperCase() === 'MO') name = 'Altria Group';
      else if (query.toUpperCase() === 'PM') name = 'Philip Morris International';
      else if (query.toUpperCase() === 'JPM') name = 'JPMorgan Chase & Co.';
      else if (query.toUpperCase() === 'BAC') name = 'Bank of America Corporation';
      else if (query.toUpperCase() === 'WFC') name = 'Wells Fargo & Company';
      else if (query.toUpperCase() === 'C') name = 'Citigroup Inc.';
      else if (query.toUpperCase() === 'MGM') name = 'MGM Resorts International';
      else if (query.toUpperCase() === 'WYNN') name = 'Wynn Resorts, Limited';
      else if (query.toUpperCase() === 'LVS') name = 'Las Vegas Sands Corp.';
      else name = `${query.toUpperCase()} Corporation`;
    } else {
      name = query.charAt(0).toUpperCase() + query.slice(1);
    }
    
    // Format ticker symbol
    let ticker = type === 'symbol' ? query.toUpperCase() : query.substring(0, 4).toUpperCase();
    
    // Return simulated API response
    return {
      ticker,
      name,
      isCompliant: !isNonCompliant,
      complianceScore,
      sector: industry,
      industry,
      financialRatios,
      reasons,
      description
    };
    
  } catch (error) {
    console.error('Error fetching Shariah compliance data:', error);
    throw error;
  }
};

// In a real implementation, you would have additional methods like:
// export const getCompanyDetails = async (ticker: string) => { ... }
// export const getScreeningCriteria = async () => { ... }
// export const getPortfolioScreening = async (tickers: string[]) => { ... }