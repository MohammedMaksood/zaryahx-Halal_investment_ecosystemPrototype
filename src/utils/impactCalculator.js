/**
 * @typedef {import('../data/sampleImpactData').ImpactMetric} ImpactMetric
 * @typedef {import('../data/sampleImpactData').InvestmentReturn} InvestmentReturn
 */

/**
 * Calculates the overall impact score based on individual metrics and their weights
 * @param {ImpactMetric[]} metrics - Array of impact metrics with scores and weights
 * @returns {number} Overall impact score (0-100)
 */
export const calculateOverallImpactScore = (metrics) => {
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
 * @param {number} financialReturn - Financial return percentage
 * @param {number} impactScore - Impact score (0-100)
 * @param {Object} weights - User preference weights for financial vs impact
 * @param {number} weights.financial - Weight for financial return (default: 0.6)
 * @param {number} weights.impact - Weight for impact score (default: 0.4)
 * @returns {number} Combined score
 */
export const calculateCombinedScore = (
  financialReturn,
  impactScore,
  weights = { financial: 0.6, impact: 0.4 }
) => {
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
 * Analyzes the trend of impact metrics over time
 * @param {number[]} trendData - Array of historical impact scores
 * @returns {Object} Trend analysis with direction and percentage change
 */
export const analyzeTrend = (trendData) => {
  if (!trendData || trendData.length < 2) {
    return { direction: 'stable', change: 0 };
  }
  
  const firstValue = trendData[0];
  const lastValue = trendData[trendData.length - 1];
  const change = ((lastValue - firstValue) / firstValue) * 100;
  
  let direction = 'stable';
  if (change > 2) direction = 'positive';
  if (change < -2) direction = 'negative';
  
  return {
    direction,
    change: parseFloat(change.toFixed(2))
  };
};

/**
 * Calculates the Shariah compliance score based on multiple factors
 * @param {Object} factors - Various compliance factors
 * @param {number} factors.debtRatio - Debt to assets ratio (0-100)
 * @param {number} factors.interestIncome - Interest income percentage (0-100)
 * @param {number} factors.prohibitedActivities - Involvement in prohibited activities (0-100)
 * @param {number} factors.socialResponsibility - Social responsibility score (0-100)
 * @returns {number} Overall Shariah compliance score (0-100)
 */
export const calculateShariahCompliance = (factors) => {
  // Default weights for different factors
  const weights = {
    debtRatio: 0.3,
    interestIncome: 0.3,
    prohibitedActivities: 0.3,
    socialResponsibility: 0.1
  };
  
  // Invert scores for negative factors (higher is worse)
  const scores = {
    debtRatio: 100 - factors.debtRatio,
    interestIncome: 100 - factors.interestIncome,
    prohibitedActivities: 100 - factors.prohibitedActivities,
    socialResponsibility: factors.socialResponsibility
  };
  
  // Calculate weighted score
  let totalScore = 0;
  for (const factor in weights) {
    totalScore += scores[factor] * weights[factor];
  }
  
  return totalScore;
};
