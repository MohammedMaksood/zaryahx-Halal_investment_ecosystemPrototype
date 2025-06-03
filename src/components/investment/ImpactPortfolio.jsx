import React, { useState } from 'react';
import ImpactMetrics from './ImpactMetrics';
import { sampleImpactInvestments, getUserImpactPreferences } from '../../data/sampleImpactData';
import { calculateImpactAdjustedReturn } from '../../utils/impactCalculator';

const ImpactPortfolio = () => {
  const [selectedInvestmentId, setSelectedInvestmentId] = useState(sampleImpactInvestments[0].id);
  const userPreferences = getUserImpactPreferences();
  
  // Get the selected investment
  const selectedInvestment = sampleImpactInvestments.find(inv => inv.id === selectedInvestmentId);
  
  // Calculate real-time adjusted returns based on current user preferences
  const adjustedInvestment = selectedInvestment ? 
    calculateImpactAdjustedReturn(selectedInvestment, userPreferences) : 
    null;
  
  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-medium text-white mb-6">Impact-Linked Investment Portfolio</h2>
      
      {/* Investment Selector */}
      <div className="mb-8">
        <label className="block text-white/80 mb-2">Select Investment</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleImpactInvestments.map(investment => (
            <button
              key={investment.id}
              onClick={() => setSelectedInvestmentId(investment.id)}
              className={`p-4 rounded-lg text-left transition-colors ${
                selectedInvestmentId === investment.id 
                  ? 'bg-lavender/20 border border-lavender' 
                  : 'bg-black/30 border border-white/10 hover:bg-black/50'
              }`}
            >
              <h3 className="font-medium text-white mb-1">{investment.name}</h3>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Return: {investment.financialReturn.toFixed(1)}%</span>
                <span className={`${
                  investment.impactScore >= 90 ? 'text-green-400' :
                  investment.impactScore >= 75 ? 'text-green-300' :
                  investment.impactScore >= 60 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  Impact: {investment.impactScore}/100
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* User Preference Controls */}
      <div className="mb-8 bg-black/30 p-4 rounded-lg border border-white/10">
        <h3 className="text-lg font-medium text-white mb-4">Your Impact Preferences</h3>
        <p className="text-white/70 mb-4">
          Adjust how much weight you place on financial returns versus social impact when evaluating investments.
        </p>
        <div className="flex items-center">
          <span className="text-white/80 w-24">Financial</span>
          <div className="flex-1 mx-4">
            <div className="w-full bg-black/50 rounded-full h-2">
              <div 
                className="bg-lavender h-2 rounded-full" 
                style={{ width: `${userPreferences.financial * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-white/80 w-16 text-right">{(userPreferences.financial * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-white/80 w-24">Impact</span>
          <div className="flex-1 mx-4">
            <div className="w-full bg-black/50 rounded-full h-2">
              <div 
                className="bg-lavender h-2 rounded-full" 
                style={{ width: `${userPreferences.impact * 100}%` }}
              ></div>
            </div>
          </div>
          <span className="text-white/80 w-16 text-right">{(userPreferences.impact * 100).toFixed(0)}%</span>
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-lavender text-white rounded-lg hover:bg-lavender/90 transition-colors">
            Adjust Preferences
          </button>
        </div>
      </div>
      
      {/* Impact Metrics Component */}
      {adjustedInvestment && (
        <ImpactMetrics 
          investment={adjustedInvestment} 
          weightPreference={userPreferences} 
        />
      )}
      
      {/* Educational Section */}
      <div className="mt-8 bg-lavender/10 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-2">About Impact-Linked Returns</h3>
        <p className="text-white/70 mb-3">
          Impact-Linked Investment Returns is a revolutionary approach that ties your financial returns to verified social impact metrics. 
          This creates a more holistic view of investment performance that aligns with Islamic values of social responsibility and ethical finance.
        </p>
        <p className="text-white/70">
          Our proprietary algorithm evaluates investments not just on their financial performance, but also on their 
          contribution to environmental sustainability, social welfare, ethical governance, and Shariah compliance.
        </p>
      </div>
    </div>
  );
};

export default ImpactPortfolio;
