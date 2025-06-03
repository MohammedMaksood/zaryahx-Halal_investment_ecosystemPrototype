import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
/**
 * @typedef {Object} UserPreference
 * @property {string} riskTolerance - User's risk tolerance level
 * @property {string[]} investmentGoals - User's investment goals
 * @property {string[]} preferredSectors - User's preferred sectors
 * @property {string} shariahStrictness - Level of Shariah compliance strictness
 * @property {string[]} preferredInvestmentTypes - User's preferred investment types
 * @property {string} rebalanceFrequency - Portfolio rebalance frequency
 * @property {Object} notificationPreferences - User's notification preferences
 * @property {boolean} notificationPreferences.marketAlerts - Market alert preferences
 * @property {boolean} notificationPreferences.complianceAlerts - Compliance alert preferences
 * @property {boolean} notificationPreferences.opportunityAlerts - Opportunity alert preferences
 * @property {boolean} notificationPreferences.portfolioUpdates - Portfolio update preferences
 */

/**
 * @typedef {Object} InsightFeedback
 * @property {string} insightId - ID of the insight
 * @property {string} insightType - Type of insight
 * @property {boolean} wasHelpful - Whether the insight was helpful
 * @property {string} [comment] - Optional user comment
 * @property {number} timestamp - Feedback timestamp
 */

const defaultPreferences = {
  riskTolerance: 'moderate',
  investmentGoals: ['long-term growth'],
  preferredSectors: ['technology', 'healthcare'],
  shariahStrictness: 'strict',
  preferredInvestmentTypes: ['stocks', 'etfs', 'sukuk'],
  rebalanceFrequency: 'quarterly',
  notificationPreferences: {
    marketAlerts: true,
    complianceAlerts: true,
    opportunityAlerts: true,
    portfolioUpdates: true
  }
};

const defaultLearningData = {
  feedbackHistory: [],
  interactionCount: 0,
  lastInteraction: null,
  acceptedRecommendations: [],
  rejectedRecommendations: [],
  preferenceStrength: {
    riskTolerance: 0.5,
    investmentGoals: 0.5,
    preferredSectors: 0.5,
    shariahStrictness: 0.7, // Higher initial confidence in Shariah preferences
  }
};

/**
 * @typedef {Object} CopilotContextType
 * @property {UserPreference} userPreferences - User preferences
 * @property {function(Object): void} updatePreferences - Update user preferences
 * @property {Object} learningData - Copilot learning data
 * @property {function(Object): void} recordFeedback - Record user feedback
 * @property {function(string, boolean): void} recordRecommendationAction - Record recommendation action
 * @property {function(): void} resetLearningData - Reset learning data
 * @property {boolean} isInitialized - Whether copilot is initialized
 */

const CopilotContext = createContext(undefined);

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};



export const CopilotProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [userPreferences, setUserPreferences] = useState(defaultPreferences);
  const [learningData, setLearningData] = useState(defaultLearningData);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load copilot data from localStorage when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedPreferences = localStorage.getItem(`copilot_preferences_${user.id}`);
      const savedLearningData = localStorage.getItem(`copilot_learning_${user.id}`);
      
      if (savedPreferences) {
        setUserPreferences(JSON.parse(savedPreferences));
      }
      
      if (savedLearningData) {
        setLearningData(JSON.parse(savedLearningData));
      }
      
      setIsInitialized(true);
    }
  }, [isAuthenticated, user]);

  // Save copilot data to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated && user && isInitialized) {
      localStorage.setItem(`copilot_preferences_${user.id}`, JSON.stringify(userPreferences));
      localStorage.setItem(`copilot_learning_${user.id}`, JSON.stringify(learningData));
    }
  }, [userPreferences, learningData, isAuthenticated, user, isInitialized]);

  /**
   * Update user preferences
   * @param {Partial<UserPreference>} preferences - Partial user preferences to update
   */
  const updatePreferences = (preferences) => {
    setUserPreferences(prev => ({
      ...prev,
      ...preferences
    }));
    
    // Update interaction data
    setLearningData(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
      lastInteraction: Date.now()
    }));
  };

  /**
   * Record user feedback
   * @param {Object} feedback - Feedback without timestamp
   * @param {string} feedback.insightId - ID of the insight
   * @param {string} feedback.insightType - Type of insight
   * @param {boolean} feedback.wasHelpful - Whether the insight was helpful
   * @param {string} [feedback.comment] - Optional user comment
   */
  const recordFeedback = (feedback) => {
    const newFeedback= {
      ...feedback,
      timestamp: Date.now()
    };
    
    setLearningData(prev => ({
      ...prev,
      feedbackHistory: [...prev.feedbackHistory, newFeedback],
      interactionCount: prev.interactionCount + 1,
      lastInteraction: Date.now(),
      
      // Update preference strength based on feedback
      preferenceStrength: {
        ...prev.preferenceStrength,
        // Increase confidence in preferences related to this insight type
        [feedback.insightType]: Math.min(
          1.0, 
          (prev.preferenceStrength[feedback.insightType] || 0.5) + (feedback.wasHelpful ? 0.05 : -0.03)
        )
      }
    }));
  };

  const recordRecommendationAction = (recommendationId, accepted) => {
    setLearningData(prev => ({
      ...prev,
      interactionCount: prev.interactionCount + 1,
      lastInteraction: Date.now(),
      acceptedRecommendations: accepted 
        ? [...prev.acceptedRecommendations, recommendationId]
        : prev.acceptedRecommendations,
      rejectedRecommendations: !accepted 
        ? [...prev.rejectedRecommendations, recommendationId]
        : prev.rejectedRecommendations
    }));
  };

  const resetLearningData = () => {
    setLearningData(defaultLearningData);
  };

  const value = {
    userPreferences,
    updatePreferences,
    learningData,
    recordFeedback,
    recordRecommendationAction,
    resetLearningData,
    isInitialized
  };

  return (
    <CopilotContext.Provider value={value}>
      {children}
    </CopilotContext.Provider>
  );
};

export default CopilotContext;
