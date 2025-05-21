import { ImpactMetric, InvestmentReturn } from '../components/investment/ImpactMetrics';

/**
 * Calculates the overall impact score based on individual metrics and their weights
 * @param metrics Array of impact metrics with scores and weights
 * @returns Overall impact score (0-100)
 */
export const calculateOverallImpactScore = (metrics: ImpactMetric[]): number => {
  // Ensure weights sum to 1
  const totalWeight = metrics.reduce((sum, metric) => sum + metric.weight, 0);
  const normalizedMetrics = metrics.map(metric => ({
    ...metric,
    weight: metric.weight / totalWeight
  }));
  
  // Calculate weighted score
  return normalizedMetrics.reduce((score, metric) => {
    return score + (metric.score * metric.weight);
  }, 0);
};

/**
 * Calculates the combined score based on financial return and impact score
 * @param financialReturn Financial return percentage
 * @param impactScore Impact score (0-100)
 * @param weights User preference weights for financial vs impact
 * @returns Combined score
 */
export const calculateCombinedScore = (
  financialReturn: number,
  impactScore: number,
  weights: { financial: number; impact: number } = { financial: 0.6, impact: 0.4 }
): number => {
  // Normalize weights to ensure they sum to 1
  const totalWeight = weights.financial + weights.impact;
  const normalizedWeights = {
    financial: weights.financial / totalWeight,
    impact: weights.impact / totalWeight
  };
  
  // Calculate combined score
  // Financial component: direct percentage contribution
  const financialComponent = financialReturn * normalizedWeights.financial;
  
  // Impact component: scaled to be comparable with financial return
  // This creates a modifier that can boost or reduce the financial return based on impact
  const impactModifier = (impactScore / 50) - 1; // -1 to +1 range centered at 50
  const impactComponent = financialReturn * impactModifier * normalizedWeights.impact;
  
  return financialComponent + impactComponent;
};

/**
 * Categorizes investments based on their combined score
 * @param combinedScore The calculated combined score
 * @returns Category label
 */
export const categorizeInvestment = (combinedScore: number): string => {
  if (combinedScore >= 15) return 'Exceptional Impact';
  if (combinedScore >= 10) return 'High Impact';
  if (combinedScore >= 5) return 'Moderate Impact';
  if (combinedScore >= 0) return 'Low Impact';
  return 'Negative Impact';
};

/**
 * Calculates the impact-adjusted return for an investment
 * This provides a complete analysis of the investment
 * @param investment Investment data with financial and impact metrics
 * @param userWeights User preference weights
 * @returns Updated investment with calculated scores
 */
export const calculateImpactAdjustedReturn = (
  investment: Omit<InvestmentReturn, 'impactScore' | 'combinedScore'>,
  userWeights: { financial: number; impact: number } = { financial: 0.6, impact: 0.4 }
): InvestmentReturn => {
  // Calculate overall impact score
  const impactScore = calculateOverallImpactScore(investment.metrics);
  
  // Calculate combined score
  const combinedScore = calculateCombinedScore(
    investment.financialReturn,
    impactScore,
    userWeights
  );
  
  // Return updated investment object
  return {
    ...investment,
    impactScore,
    combinedScore,
    historicalData: investment.historicalData.map(data => ({
      ...data,
      // If historical data doesn't have impact scores, calculate them
      impactScore: data.impactScore || impactScore,
      // Recalculate combined scores with current weights
      combinedScore: calculateCombinedScore(
        data.financialReturn,
        data.impactScore || impactScore,
        userWeights
      )
    }))
  };
};

/**
 * Predicts future impact based on historical trends
 * @param metrics Current impact metrics
 * @param periods Number of periods to forecast
 * @returns Predicted future impact metrics
 */
export const predictFutureImpact = (
  metrics: ImpactMetric[],
  periods: number = 3
): ImpactMetric[] => {
  return metrics.map(metric => {
    // Simple linear regression to predict future trend
    const trend = [...metric.trend];
    const n = trend.length;
    
    if (n < 2) return metric; // Not enough data for prediction
    
    // Calculate average rate of change
    const avgChange = (trend[n-1] - trend[0]) / (n - 1);
    
    // Predict future values
    const lastValue = trend[n-1];
    const predictedValues = Array(periods).fill(0).map((_, i) => 
      Math.min(100, Math.max(0, lastValue + avgChange * (i + 1)))
    );
    
    return {
      ...metric,
      predictedTrend: predictedValues
    };
  });
};
