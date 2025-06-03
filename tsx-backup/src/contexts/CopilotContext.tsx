import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface UserPreference {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  investmentGoals: string[];
  preferredSectors: string[];
  shariahStrictness: 'standard' | 'strict' | 'very-strict';
  preferredInvestmentTypes: string[];
  rebalanceFrequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  notificationPreferences: {
    marketAlerts: boolean;
    complianceAlerts: boolean;
    opportunityAlerts: boolean;
    portfolioUpdates: boolean;
  };
}

interface InsightFeedback {
  insightId: string;
  insightType: string;
  wasHelpful: boolean;
  timestamp: number;
}

interface LearningData {
  feedbackHistory: InsightFeedback[];
  interactionCount: number;
  lastInteraction: number;
  acceptedRecommendations: string[];
  rejectedRecommendations: string[];
  preferenceStrength: Record<string, number>; // Measures confidence in preference predictions
}

interface CopilotContextType {
  userPreferences: UserPreference;
  updatePreferences: (preferences: Partial<UserPreference>) => void;
  learningData: LearningData;
  recordFeedback: (feedback: Omit<InsightFeedback, 'timestamp'>) => void;
  recordRecommendationAction: (recommendationId: string, accepted: boolean) => void;
  resetLearningData: () => void;
  isInitialized: boolean;
}

const defaultPreferences: UserPreference = {
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

const defaultLearningData: LearningData = {
  feedbackHistory: [],
  interactionCount: 0,
  lastInteraction: 0,
  acceptedRecommendations: [],
  rejectedRecommendations: [],
  preferenceStrength: {
    riskTolerance: 0.5,
    investmentGoals: 0.5,
    preferredSectors: 0.5,
    shariahStrictness: 0.7, // Higher initial confidence in Shariah preferences
  }
};

const CopilotContext = createContext<CopilotContextType | undefined>(undefined);

export const useCopilot = () => {
  const context = useContext(CopilotContext);
  if (context === undefined) {
    throw new Error('useCopilot must be used within a CopilotProvider');
  }
  return context;
};

interface CopilotProviderProps {
  children: ReactNode;
}

export const CopilotProvider: React.FC<CopilotProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [userPreferences, setUserPreferences] = useState<UserPreference>(defaultPreferences);
  const [learningData, setLearningData] = useState<LearningData>(defaultLearningData);
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

  const updatePreferences = (preferences: Partial<UserPreference>) => {
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

  const recordFeedback = (feedback: Omit<InsightFeedback, 'timestamp'>) => {
    const newFeedback: InsightFeedback = {
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

  const recordRecommendationAction = (recommendationId: string, accepted: boolean) => {
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
