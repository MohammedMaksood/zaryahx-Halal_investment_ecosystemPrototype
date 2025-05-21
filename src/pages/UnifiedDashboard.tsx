import React, { useState } from 'react';
import { useUnifiedData } from '../contexts/UnifiedDataContext';
import { useResetAnimation } from '../hooks/useResetAnimation';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart
} from 'recharts';
// Define module components with dynamic imports from the unified directory
const ModuleComponents = {
  investments: React.lazy(() => import('../components/unified/InvestmentModule').catch(() => ({ default: () => <FallbackModuleComponent title="Investment Portfolio" description="Your Shariah-compliant investment dashboard will appear here." /> }))),
  banking: React.lazy(() => import('../components/unified/BankingModule').catch(() => ({ default: () => <FallbackModuleComponent title="Islamic Banking" description="Your Islamic banking products and services will appear here." /> }))),
  shopping: React.lazy(() => import('../components/unified/ShoppingModule').catch(() => ({ default: () => <FallbackModuleComponent title="Halal Shopping" description="Your halal product verification and shopping history will appear here." /> }))),
  charity: React.lazy(() => import('../components/unified/CharityModule').catch(() => ({ default: () => <FallbackModuleComponent title="Zakat & Charity" description="Your zakat calculations and donation tracking will appear here." /> })))
};

// Fallback components in case the imports fail
const FallbackModuleComponent = ({ title, description }: { title: string, description: string }) => (
  <div className="p-6 bg-background/30 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

const UnifiedDashboard: React.FC = () => {
  const { unifiedData, loading, error, refreshData } = useUnifiedData();
  const [activeModule, setActiveModule] = useState<'investments' | 'banking' | 'shopping' | 'charity'>('investments');
  
  // Use our custom hook to handle animation resets when navigating from navbar
  const animateHeader = useResetAnimation(false, 300);
  
  // Colors for the charts with Islamic-inspired palette
  const COLORS = ['#9b87f5', '#6c5ce7', '#a29bfe', '#54a0ff'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/90">
        <div className="relative">
          {/* Islamic geometric pattern background */}
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="w-[600px] h-[600px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute top-1/2 left-1/2 border border-lavender/30 rounded-full"
                  style={{
                    width: `${(i+1) * 75}px`,
                    height: `${(i+1) * 75}px`,
                    transform: 'translate(-50%, -50%)',
                    animation: `pulse ${3 + i * 0.5}s infinite ease-in-out alternate`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="text-center relative z-10">
            {/* Stylized loading animation */}
            <div className="relative mx-auto w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender to-lavender-dark opacity-20 animate-ping"></div>
              <div className="absolute inset-2 rounded-full border-4 border-lavender border-t-transparent animate-spin"></div>
              <div className="absolute inset-6 rounded-full border-4 border-lavender-dark border-b-transparent animate-spin-slow"></div>
              <div className="absolute inset-10 rounded-full border-4 border-lavender border-l-transparent animate-spin-reverse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-10 h-10 text-lavender animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Preparing Your Dashboard</h3>
            <p className="text-lg text-white/70 max-w-md">Loading your personalized Halal lifestyle insights and recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/90">
        <div className="text-center bg-background/40 backdrop-blur-xl p-10 rounded-2xl border border-red-500/20 shadow-2xl max-w-md relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            {/* Error icon with animation */}
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-red-500/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Connection Error</h2>
            <p className="text-white/80 mb-8 text-lg">{error}</p>
            
            <button 
              onClick={() => refreshData()} 
              className="px-8 py-4 bg-gradient-to-r from-lavender to-lavender-dark text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md font-medium text-lg group"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Dashboard
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!unifiedData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/90">
        <div className="text-center bg-background/40 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl max-w-md relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-lavender/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-lavender/10 rounded-full blur-2xl"></div>
          
          <div className="relative">
            {/* Empty state illustration */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lavender/20 to-lavender-dark/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-lavender/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-3">No Data Available</h2>
            <p className="text-white/70 mb-8">We couldn't find any lifestyle data for your account. Let's refresh to get started with your halal lifestyle journey.</p>
            
            <button 
              onClick={() => refreshData()} 
              className="px-8 py-4 bg-gradient-to-r from-lavender to-lavender-dark text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md font-medium group"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Initialize Dashboard
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 pb-12">
      {/* Header Section with Islamic-inspired design */}
      <div className="relative overflow-hidden">
        {/* Animated geometric background pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-lavender/20 to-purple-900/20"></div>
        <div className="absolute inset-0 overflow-hidden">
          {/* Islamic geometric pattern overlay */}
          <div className="absolute inset-0 bg-[url('/assets/islamic-pattern.svg')] bg-repeat opacity-5"></div>
          
          {/* Animated decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-lavender/10"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: Math.random() * 0.5,
                  filter: 'blur(50px)',
                  animation: `float ${Math.random() * 10 + 20}s infinite ease-in-out alternate`,
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="container mx-auto px-6 py-10 relative z-10">
          {/* Back button */}
          <div className="mb-6">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center text-white/80 hover:text-white transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>
          
          <div className={`transition-all duration-1000 transform ${animateHeader ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Decorative Arabic calligraphy-inspired element */}
            <div className="flex justify-center mb-4">
              <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-lavender to-transparent rounded-full"></div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
              <span className="text-white">Unified </span>
              <span className="text-lavender">Halal</span>
              <span className="text-white"> Lifestyle</span>
            </h1>
            
            <p className="text-white/70 text-center text-base max-w-2xl mx-auto mb-8">
              Your comprehensive dashboard for managing all aspects of your Shariah-compliant
              financial journey in one integrated ecosystem
            </p>
            
            {/* Decorative divider */}
            <div className="flex justify-center mt-10">
              <div className="relative w-24 h-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-lavender/50 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-lavender"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        {/* Overall Compliance Score Card */}
        <div className="bg-background/40 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-8 mb-8 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-lavender/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-lavender/5 rounded-full blur-3xl"></div>
          
          {/* Islamic geometric pattern */}
          <div className="absolute inset-0 opacity-5 bg-[url('/assets/geometric-pattern.svg')] bg-repeat"></div>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
            <div className="w-full lg:w-1/3 flex justify-center mb-6 lg:mb-0">
              <div className="relative group">
                {/* Outer decorative ring */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-lavender/10 to-lavender-dark/10 blur-xl group-hover:from-lavender/20 group-hover:to-lavender-dark/20 transition-all duration-700"></div>
                
                {/* Main compliance circle */}
                <div className="w-64 h-64 rounded-full bg-background/50 flex items-center justify-center relative">
                  {/* Animated particles around the circle */}
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-lavender/70"
                      style={{
                        top: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`,
                        left: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                        animation: `pulse ${2 + Math.random() * 2}s infinite ease-in-out alternate`,
                      }}
                    ></div>
                  ))}
                  
                  {/* Inner circle */}
                  <div className="w-48 h-48 rounded-full bg-background/80 flex items-center justify-center border border-white/10 shadow-inner relative z-10">
                    {/* Decorative Islamic pattern inside */}
                    <div className="absolute inset-0 rounded-full overflow-hidden opacity-5">
                      <div className="absolute inset-0 bg-[url('/assets/arabesque.svg')] bg-center bg-no-repeat bg-contain"></div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-lavender to-lavender-light">
                        {unifiedData.overallCompliance}%
                      </p>
                      <p className="text-sm text-white/70 mt-2 tracking-wide uppercase font-medium">Overall Compliance</p>
                    </div>
                  </div>
                </div>
                
                {/* Animated progress circle */}
                <div className="absolute top-0 left-0 w-64 h-64">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Background track */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeWidth="6" 
                    />
                    
                    {/* Glowing effect for the progress */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#glowGradient)" 
                      strokeWidth="6" 
                      strokeDasharray={`${unifiedData.overallCompliance * 2.83} 283`}
                      strokeDashoffset="0" 
                      transform="rotate(-90 50 50)" 
                      filter="blur(3px)"
                      opacity="0.5"
                    />
                    
                    {/* Main progress circle */}
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#progressGradient)" 
                      strokeWidth="6" 
                      strokeDasharray={`${unifiedData.overallCompliance * 2.83} 283`}
                      strokeDashoffset="0" 
                      transform="rotate(-90 50 50)" 
                      strokeLinecap="round"
                    />
                    
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9b87f5" />
                        <stop offset="100%" stopColor="#6c5ce7" />
                      </linearGradient>
                      <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9b87f5" />
                        <stop offset="100%" stopColor="#6c5ce7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Lifestyle Breakdown</h2>
                <div className="ml-4 px-3 py-1 bg-lavender/20 rounded-full">
                  <span className="text-xs font-medium text-lavender">AI-Powered Analysis</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Domain Distribution Chart */}
                <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-lg overflow-hidden relative group hover:border-lavender/30 transition-colors duration-500">
                  {/* Background decorative elements */}
                  <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-lavender/5 rounded-full blur-xl group-hover:bg-lavender/10 transition-colors duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white/90">Domain Distribution</h3>
                      <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-lavender" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Investments', value: unifiedData.lifestyleBreakdown.investments, icon: '📈' },
                            { name: 'Banking', value: unifiedData.lifestyleBreakdown.banking, icon: '🏦' },
                            { name: 'Shopping', value: unifiedData.lifestyleBreakdown.shopping, icon: '🛒' },
                            { name: 'Charity', value: unifiedData.lifestyleBreakdown.charity, icon: '🤲' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, percent, icon }) => `${icon} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                          animationBegin={300}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        >
                          {[
                            { name: 'Investments', value: unifiedData.lifestyleBreakdown.investments },
                            { name: 'Banking', value: unifiedData.lifestyleBreakdown.banking },
                            { name: 'Shopping', value: unifiedData.lifestyleBreakdown.shopping },
                            { name: 'Charity', value: unifiedData.lifestyleBreakdown.charity }
                          ].map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                              stroke="rgba(0,0,0,0.1)"
                              strokeWidth={1}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => `${value}%`} 
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 25, 35, 0.9)', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(155, 135, 245, 0.2)',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                            padding: '12px'
                          }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Legend */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { name: 'Investments', value: unifiedData.lifestyleBreakdown.investments, color: COLORS[0] },
                        { name: 'Banking', value: unifiedData.lifestyleBreakdown.banking, color: COLORS[1] },
                        { name: 'Shopping', value: unifiedData.lifestyleBreakdown.shopping, color: COLORS[2] },
                        { name: 'Charity', value: unifiedData.lifestyleBreakdown.charity, color: COLORS[3] }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs text-white/70">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Compliance Trend Chart */}
                <div className="bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-lg overflow-hidden relative group hover:border-lavender/30 transition-colors duration-500">
                  {/* Background decorative elements */}
                  <div className="absolute -top-16 -left-16 w-32 h-32 bg-lavender/5 rounded-full blur-xl group-hover:bg-lavender/10 transition-colors duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white/90">Compliance Trend</h3>
                      <div className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-lavender" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart
                        data={unifiedData.complianceTrend}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          stroke="rgba(255,255,255,0.5)" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[80, 100]} 
                          stroke="rgba(255,255,255,0.5)" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          width={30}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(23, 25, 35, 0.9)', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(155, 135, 245, 0.2)',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                            padding: '12px'
                          }}
                          itemStyle={{ color: '#fff' }}
                          labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
                          formatter={(value) => [`${value}%`, 'Compliance']}
                          labelFormatter={(label) => `Month: ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#9b87f5"
                          fillOpacity={1}
                          fill="url(#colorScore)"
                          animationDuration={2000}
                          animationEasing="ease-out"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#9b87f5" 
                          strokeWidth={3} 
                          dot={{ fill: '#9b87f5', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 8, fill: '#6c5ce7', strokeWidth: 0 }}
                          animationDuration={2000}
                          animationEasing="ease-out"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Trend indicators */}
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
                        <span className="text-xs text-white/70">Improving trend</span>
                      </div>
                      <div className="text-xs text-white/70">
                        <span className="font-medium text-lavender">+{unifiedData.complianceTrend[unifiedData.complianceTrend.length-1].score - unifiedData.complianceTrend[0].score}%</span> growth
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Radar Chart for Compliance Dimensions */}
              <div className="mt-8 bg-background/30 backdrop-blur-sm rounded-xl p-6 border border-white/5 shadow-lg overflow-hidden relative group hover:border-lavender/30 transition-colors duration-500">
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-lavender/5 rounded-full blur-xl group-hover:bg-lavender/10 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white/90">Shariah Compliance Dimensions</h3>
                    <div className="px-3 py-1 rounded-full bg-lavender/20">
                      <span className="text-xs font-medium text-lavender">Multi-dimensional Analysis</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="w-full lg:w-1/2">
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                          { subject: 'Interest-Free', A: 95 },
                          { subject: 'Ethical Business', A: 90 },
                          { subject: 'Profit Sharing', A: 88 },
                          { subject: 'Asset-Backed', A: 94 },
                          { subject: 'Transparency', A: 92 },
                          { subject: 'Social Impact', A: 85 }
                        ]}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                          <Radar name="Compliance" dataKey="A" stroke="#9b87f5" fill="#9b87f5" fillOpacity={0.3} animationDuration={2000} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(23, 25, 35, 0.9)', 
                              borderRadius: '12px', 
                              border: '1px solid rgba(155, 135, 245, 0.2)',
                              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                              padding: '12px'
                            }}
                            formatter={(value) => [`${value}%`, 'Compliance']}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="w-full lg:w-1/2">
                      <h4 className="text-white font-medium mb-4">Dimension Analysis</h4>
                      <div className="space-y-4">
                        {[
                          { name: 'Interest-Free', score: 95, description: 'All financial activities avoid interest (riba)' },
                          { name: 'Ethical Business', score: 90, description: 'Investments in ethical and permissible businesses' },
                          { name: 'Profit Sharing', score: 88, description: 'Risk sharing between parties rather than guaranteed returns' },
                          { name: 'Asset-Backed', score: 94, description: 'Transactions backed by real assets, not speculation' },
                          { name: 'Transparency', score: 92, description: 'Clear disclosure of terms and conditions' },
                          { name: 'Social Impact', score: 85, description: 'Positive contribution to society and environment' }
                        ].map((dimension, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-full max-w-[180px]">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-white/70">{dimension.name}</span>
                                <span className="text-xs font-medium text-lavender">{dimension.score}%</span>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div 
                                  className="h-1.5 rounded-full bg-gradient-to-r from-lavender to-lavender-dark" 
                                  style={{ width: `${dimension.score}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="ml-4 text-xs text-white/60 hidden lg:block">{dimension.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Navigation - Islamic-inspired design */}
        <div className="relative mb-10 mt-4">
          {/* Decorative Islamic pattern background */}
          <div className="absolute inset-0 -z-10 bg-[url('/assets/islamic-pattern.svg')] bg-repeat opacity-5"></div>
          
          {/* Decorative divider with Islamic-inspired design */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-lavender/30 to-transparent"></div>
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-lavender/30 flex items-center justify-center bg-background/50 backdrop-blur-md">
                  <div className="w-8 h-8 rounded-full border border-lavender/50 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-lavender/70"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium text-white/90">Explore Your Halal Lifestyle Domains</h3>
            <p className="text-white/60 mt-2 max-w-2xl mx-auto">Navigate through different aspects of your Shariah-compliant lifestyle to view detailed insights and take actions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
            {/* Investment Module Button */}
            <button
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${activeModule === 'investments' ? 'ring-2 ring-lavender/50 ring-offset-4 ring-offset-background/50' : ''}`}
              onClick={() => setActiveModule('investments')}
            >
              {/* Background effects */}
              <div className={`absolute inset-0 ${activeModule === 'investments' ? 'bg-gradient-to-br from-lavender/80 to-lavender-dark/80' : 'bg-background/40'} backdrop-blur-md transition-colors duration-500 group-hover:bg-lavender/30`}></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full transform translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full transform -translate-x-1/4 translate-y-1/4"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${activeModule === 'investments' ? 'bg-white/20' : 'bg-lavender/10'} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${activeModule === 'investments' ? 'text-white' : 'text-lavender'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-medium ${activeModule === 'investments' ? 'text-white' : 'text-white/80'} transition-colors duration-500`}>Investments</h4>
                <p className={`text-xs mt-2 ${activeModule === 'investments' ? 'text-white/80' : 'text-white/50'} transition-colors duration-500`}>Shariah-compliant portfolio</p>
                
                {/* Status indicator */}
                <div className="mt-4 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${activeModule === 'investments' ? 'bg-white' : 'bg-lavender/40'} mr-2`}></div>
                  <span className={`text-xs ${activeModule === 'investments' ? 'text-white/90' : 'text-white/50'}`}>
                    {activeModule === 'investments' ? 'Active' : `${unifiedData.investments.portfolioCompliance}% compliant`}
                  </span>
                </div>
              </div>
            </button>
            
            {/* Banking Module Button */}
            <button
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${activeModule === 'banking' ? 'ring-2 ring-lavender/50 ring-offset-4 ring-offset-background/50' : ''}`}
              onClick={() => setActiveModule('banking')}
            >
              {/* Background effects */}
              <div className={`absolute inset-0 ${activeModule === 'banking' ? 'bg-gradient-to-br from-lavender/80 to-lavender-dark/80' : 'bg-background/40'} backdrop-blur-md transition-colors duration-500 group-hover:bg-lavender/30`}></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full transform translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full transform -translate-x-1/4 translate-y-1/4"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${activeModule === 'banking' ? 'bg-white/20' : 'bg-lavender/10'} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${activeModule === 'banking' ? 'text-white' : 'text-lavender'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l9-4 9 4m-9-4v20m-3-3h6m-6-3h6m6-10v2a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4h8a4 4 0 014 4z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-medium ${activeModule === 'banking' ? 'text-white' : 'text-white/80'} transition-colors duration-500`}>Banking</h4>
                <p className={`text-xs mt-2 ${activeModule === 'banking' ? 'text-white/80' : 'text-white/50'} transition-colors duration-500`}>Islamic financial products</p>
                
                {/* Status indicator */}
                <div className="mt-4 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${activeModule === 'banking' ? 'bg-white' : 'bg-lavender/40'} mr-2`}></div>
                  <span className={`text-xs ${activeModule === 'banking' ? 'text-white/90' : 'text-white/50'}`}>
                    {activeModule === 'banking' ? 'Active' : `$${unifiedData.banking.totalBalance.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </button>
            
            {/* Shopping Module Button */}
            <button
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${activeModule === 'shopping' ? 'ring-2 ring-lavender/50 ring-offset-4 ring-offset-background/50' : ''}`}
              onClick={() => setActiveModule('shopping')}
            >
              {/* Background effects */}
              <div className={`absolute inset-0 ${activeModule === 'shopping' ? 'bg-gradient-to-br from-lavender/80 to-lavender-dark/80' : 'bg-background/40'} backdrop-blur-md transition-colors duration-500 group-hover:bg-lavender/30`}></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full transform translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full transform -translate-x-1/4 translate-y-1/4"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${activeModule === 'shopping' ? 'bg-white/20' : 'bg-lavender/10'} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${activeModule === 'shopping' ? 'text-white' : 'text-lavender'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-medium ${activeModule === 'shopping' ? 'text-white' : 'text-white/80'} transition-colors duration-500`}>Shopping</h4>
                <p className={`text-xs mt-2 ${activeModule === 'shopping' ? 'text-white/80' : 'text-white/50'} transition-colors duration-500`}>Halal product verification</p>
                
                {/* Status indicator */}
                <div className="mt-4 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${activeModule === 'shopping' ? 'bg-white' : 'bg-lavender/40'} mr-2`}></div>
                  <span className={`text-xs ${activeModule === 'shopping' ? 'text-white/90' : 'text-white/50'}`}>
                    {activeModule === 'shopping' ? 'Active' : `${unifiedData.shopping.complianceRate}% verified`}
                  </span>
                </div>
              </div>
            </button>
            
            {/* Charity Module Button */}
            <button
              className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${activeModule === 'charity' ? 'ring-2 ring-lavender/50 ring-offset-4 ring-offset-background/50' : ''}`}
              onClick={() => setActiveModule('charity')}
            >
              {/* Background effects */}
              <div className={`absolute inset-0 ${activeModule === 'charity' ? 'bg-gradient-to-br from-lavender/80 to-lavender-dark/80' : 'bg-background/40'} backdrop-blur-md transition-colors duration-500 group-hover:bg-lavender/30`}></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-bl-full transform translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full transform -translate-x-1/4 translate-y-1/4"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${activeModule === 'charity' ? 'bg-white/20' : 'bg-lavender/10'} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${activeModule === 'charity' ? 'text-white' : 'text-lavender'} transition-colors duration-500`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-medium ${activeModule === 'charity' ? 'text-white' : 'text-white/80'} transition-colors duration-500`}>Charity</h4>
                <p className={`text-xs mt-2 ${activeModule === 'charity' ? 'text-white/80' : 'text-white/50'} transition-colors duration-500`}>Zakat & donations</p>
                
                {/* Status indicator */}
                <div className="mt-4 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${activeModule === 'charity' ? 'bg-white' : 'bg-lavender/40'} mr-2`}></div>
                  <span className={`text-xs ${activeModule === 'charity' ? 'text-white/90' : 'text-white/50'}`}>
                    {activeModule === 'charity' ? 'Active' : `$${unifiedData.charity.zakatDue} due`}
                  </span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Active Module Content */}
        <div className="bg-background/40 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-6">
          <React.Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <div className="w-12 h-12 border-4 border-lavender border-t-transparent rounded-full animate-spin"></div>
              <p className="ml-4 text-lg font-medium text-white/80">Loading module...</p>
            </div>
          }>
            {(() => {
              const ActiveModule = ModuleComponents[activeModule];
              // Type assertion to handle the different module data types
              return <ActiveModule data={unifiedData[activeModule] as any} />;
            })()}
          </React.Suspense>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
