import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';

// Define the data structure for impact metrics
export interface ImpactMetric {
  id: string;
  name: string;
  category: 'environmental' | 'social' | 'governance' | 'ethical';
  score: number; // 0-100
  weight: number; // 0-1, sum of all weights should be 1
  description: string;
  trend: number[]; // Last 6 months of data
}

export interface InvestmentReturn {
  id: string;
  name: string;
  financialReturn: number; // Percentage
  impactScore: number; // 0-100
  combinedScore: number; // Calculated based on both financial and impact
  metrics: ImpactMetric[];
  historicalData: {
    month: string;
    financialReturn: number;
    impactScore: number;
    combinedScore: number;
  }[];
}

interface ImpactMetricsProps {
  investment: InvestmentReturn;
  weightPreference?: {
    financial: number; // 0-1
    impact: number; // 0-1
  };
}

const COLORS = ['#8A4FFF', '#FF6B8B', '#36D7B7', '#FFCE56', '#9966FF'];

const ImpactMetrics: React.FC<ImpactMetricsProps> = ({ 
  investment,
  weightPreference = { financial: 0.6, impact: 0.4 }
}) => {
  // Calculate the combined score based on weight preferences
  const calculateCombinedScore = (financial: number, impact: number) => {
    return (financial * weightPreference.financial) + 
           ((impact / 100) * weightPreference.impact * 100);
  };

  // Prepare data for impact breakdown pie chart
  const impactBreakdownData = investment.metrics.map(metric => ({
    name: metric.name,
    value: metric.score * metric.weight,
    color: metric.category === 'environmental' ? COLORS[0] :
           metric.category === 'social' ? COLORS[1] :
           metric.category === 'governance' ? COLORS[2] :
           COLORS[3]
  }));

  // Prepare data for comparison chart
  const comparisonData = [
    { name: 'Financial', value: investment.financialReturn },
    { name: 'Impact', value: investment.impactScore / 100 * investment.financialReturn }, // Scale impact to be comparable
    { name: 'Combined', value: investment.combinedScore }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-medium text-white mb-6">Impact-Linked Investment Returns</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/30 p-4 rounded-lg border border-white/5">
          <p className="text-white/60 text-sm mb-1">Financial Return</p>
          <p className="text-2xl font-bold text-white">{investment.financialReturn.toFixed(2)}%</p>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-white/5">
          <p className="text-white/60 text-sm mb-1">Impact Score</p>
          <p className="text-2xl font-bold text-lavender">{investment.impactScore.toFixed(0)}/100</p>
        </div>
        <div className="bg-black/30 p-4 rounded-lg border border-white/5">
          <p className="text-white/60 text-sm mb-1">Combined Score</p>
          <p className="text-2xl font-bold text-white">{investment.combinedScore.toFixed(2)}%</p>
        </div>
      </div>

      {/* Impact Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Impact Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={impactBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {impactBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}`, 'Score']}
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}
                  labelStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div className="space-y-4">
              {investment.metrics.map((metric) => (
                <div key={metric.id} className="bg-black/20 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-medium">{metric.name}</span>
                    <span className="text-lavender">{metric.score}/100</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-2">
                    <div 
                      className="bg-lavender h-2 rounded-full" 
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-xs mt-1">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Performance */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Historical Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={investment.historicalData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}
                labelStyle={{ color: 'white' }}
              />
              <Legend />
              <Line type="monotone" dataKey="financialReturn" stroke="#36D7B7" activeDot={{ r: 8 }} name="Financial Return %" />
              <Line type="monotone" dataKey="impactScore" stroke="#8A4FFF" name="Impact Score" />
              <Line type="monotone" dataKey="combinedScore" stroke="#FF6B8B" name="Combined Score" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Return Comparison */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Return Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
              <YAxis stroke="rgba(255,255,255,0.6)" />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Return']}
                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)' }}
                labelStyle={{ color: 'white' }}
              />
              <Bar dataKey="value" fill="#8A4FFF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Preference Disclaimer */}
      <div className="mt-6 p-4 bg-lavender/10 rounded-lg">
        <p className="text-white/80 text-sm">
          Your current preference weights: {weightPreference.financial * 100}% Financial, {weightPreference.impact * 100}% Impact. 
          Adjust these in your profile settings to reflect your investment priorities.
        </p>
      </div>
    </div>
  );
};

export default ImpactMetrics;
