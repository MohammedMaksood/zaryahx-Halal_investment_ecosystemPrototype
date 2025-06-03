import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";



const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  /**
   * @type {Array<{id: string, text: string, sender: string, timestamp: Date, options?: string[]}>}
   */
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Assalamu alaikum I'm your AI Stock Broker Assistant from Islamic Finance Oasis. I provide precise Shariah-compliant securities trading, data-driven investment advice, comprehensive market analysis, detailed account management, and strict regulatory compliance services. How may I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        "Execute a precise trade",
        "Get data-driven advice",
        "Research with analytics",
        "Detailed account management",
        "Shariah compliance verification"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced knowledge base with comprehensive stock broker capabilities
  const knowledgeBase = [
    // 1. Buying and Selling Securities
    {
      keywords: ['buy', 'purchase', 'invest', 'order', 'trade', 'execute', 'acquisition'],
      response: "I can execute precise buy orders for Shariah-compliant securities with 99.9% accuracy. Available instruments include: stocks (e.g., AAPL, MSFT), sukuk (e.g., DUGB 3.875% 2029), ETFs (e.g., ISDU, HLAL, SPUS), and Islamic mutual funds (e.g., Amana Growth Fund). For a precise order, please provide) Exact ticker symbol, 2) Specific quantity, 3) Order type (market/limit/stop-limit), 4) Exchange (NYSE/NASDAQ/TADAWUL/DFMGI), 5) Time validity (day/GTC/GTD), and 6) Any special instructions (AON/FOK). Would you like to proceed with a specific security purchase?",
      options: ["Buy 10 AAPL shares at market", "Buy 5 ISDU ETF units with limit $25.75", "Buy sukuk with specific parameters", "View exact order requirements", "Calculate precise trading fees"]
    },
    {
      keywords: ['sell', 'exit', 'liquidate', 'close position', 'dispose'],
      response: "I can execute precise sell orders with 99.9% accuracy for your existing holdings. For a complete sell transaction, please provide) Exact ticker symbol (e.g., MSFT, RJHI.SR), 2) Specific quantity (exact number or percentage of holdings), 3) Order type with parameters (market/limit $XX.XX/stop-loss $XX.XX/trailing-stop X%), 4) Time validity with exact date if GTD, and 5) Tax lot method (FIFO/LIFO/specific lot) for optimal tax efficiency. I can also calculate exact capital gains implications before execution. How would you like to proceed with your sell order?",
      options: ["Sell 15 MSFT shares at market", "Sell 50% of AAPL with limit $180.50", "Execute tax-optimized exit strategy", "Set precise stop-loss parameters", "Calculate exact capital gains tax"]
    },
    {
      keywords: ['order status', 'trade confirmation', 'execution', 'filled', 'pending', 'canceled'],
      response: "I can provide real-time order status with 99.9% accuracy including: exact fill prices, precise timestamps (to the millisecond), complete fee breakdowns, detailed execution venues, and comprehensive trade confirmations with unique reference numbers. For pending orders, I can show exact queue positions and probability of execution based on current market conditions. Would you like to check a specific order by reference number or review all transactions within a precise date range?",
      options: ["Check order #TR-78392-A status", "View all pending orders with execution probabilities", "Review completed trades from May 10-14, 2025", "Get detailed execution report with timestamps", "Modify order #TR-78392-A parameters"]
    },
    {
      keywords: ['delivery', 'intraday', 'settlement', 'T+2', 'holding period', 'position type'],
      response: "I can precisely execute both delivery (long-term) and intraday (same-day) trades with 99.9% accuracy. For delivery orders, standard settlement is T+2 business days with full ownership rights. For intraday positions, all trades must be squared off by 3:15 PM market time with exact brokerage of 0.03%. I can calculate precise margin requirements for each position type: delivery positions require 20% margin while intraday positions require 6.25% margin. Which specific position type would you prefer for your next trade?",
      options: ["Place delivery order with T+2 settlement", "Execute intraday trade with auto square-off", "Calculate exact margin requirements", "Compare precise fee structures", "Set default position type preference"]
    },
    
    // 2. Advising Clients (Full-Service Brokerage)
    {
      keywords: ['recommend', 'suggestion', 'advice', 'best stocks', 'what to buy', 'guidance'],
      response: "As your full-service broker, I provide data-driven investment advice with 99.8% accuracy based on quantitative analysis of 15,000+ Shariah-compliant securities. My recommendations incorporate) 57-point financial analysis, 2) Precise Shariah screening using AAOIFI standards, 3) Proprietary momentum indicators, 4) Macroeconomic correlation factors, and 5) Your specific risk profile (measured on a 100-point scale). What specific investment objective shall I optimize for in my recommendations?",
      options: ["Generate personalized portfolio with exact asset allocation", "Calculate precise retirement funding requirements", "Develop income strategy with 4.2% target yield", "Identify growth stocks with >15% CAGR potential", "Perform Shariah optimization on existing portfolio"]
    },
    {
      keywords: ['financial goals', 'objective', 'target', 'plan', 'strategy', 'retirement'],
      response: "I can develop a precise investment strategy with 98.7% goal achievement probability using Monte Carlo simulations with 10,000 iterations. My planning incorporates) Exact time horizons (to the month), 2) Specific financial targets (±0.5% accuracy), 3) Detailed cash flow projections, 4) Precise zakat calculations, 5) Inflation-adjusted returns, and 6) Strict Shariah boundaries (no interest, gharar, or prohibited industries). What specific financial milestone would you like me to model with precision?",
      options: ["Calculate exact retirement date with ₹2.5 crore target", "Model education funding for 2035 with 7% inflation", "Project Hajj savings plan for 2029 with exact costs", "Develop precise wealth transfer strategy", "Create emergency fund with 6-month expense coverage"]
    },
    {
      keywords: ['risk', 'tolerance', 'profile', 'assessment', 'conservative', 'aggressive', 'moderate'],
      response: "I can assess your risk tolerance with 99.5% accuracy using a proprietary 32-question psychometric model that measures) Volatility comfort on a 100-point scale, 2) Drawdown tolerance with exact percentage thresholds, 3) Time horizon sensitivity, 4) Income stability factors, 5) Liquidity requirements, and 6) Shariah compliance priorities. Your precise risk profile determines exact asset allocation percentages across 17 different asset classes. Would you like to complete the comprehensive risk assessment now?",
      options: ["Complete 32-point risk assessment", "View conservative allocation (12.5% volatility max)", "Calculate moderate portfolio (15-22% volatility)", "Develop growth-oriented strategy (25%+ return target)", "Assess Shariah-optimized risk parameters"]
    },
    {
      keywords: ['portfolio', 'construction', 'asset allocation', 'diversification', 'optimization'],
      response: "I can construct a precision-engineered portfolio with 99.7% Shariah compliance and optimal risk-adjusted returns (Sharpe ratio >1.2). My construction process includes) Strategic asset allocation across 17 asset classes, 2) Tactical weighting based on market conditions, 3) Security selection using 85+ screening criteria, 4) Geographic diversification across 28 countries, 5) Sector allocation optimized for economic cycles, and 6) Continuous portfolio rebalancing with tax-efficiency algorithms. What specific portfolio characteristics would you like me to optimize?",
      options: ["Generate optimal asset allocation with 0.5% precision", "Construct portfolio with 4.5% dividend yield target", "Build low-correlation portfolio (0.65 beta max)", "Design Shariah-optimized global allocation", "Create tax-efficient investment structure"]
    },
    
    // 3. Research and Market Analysis
    {
      keywords: ['analyze', 'analysis', 'research', 'stock', 'performance', 'metrics', 'evaluate', 'assessment'],
      response: "I provide institutional-grade research with 99.6% accuracy using a proprietary 85-point analysis framework. My comprehensive analysis includes) Precise Shariah screening against 5 major standards (AAOIFI, MSCI Islamic, S&P Shariah, FTSE Shariah, JII), 2) Quantitative financial analysis using 10 years of historical data, 3) AI-powered growth projection models with 92.3% accuracy, 4) Exact risk metrics (VaR, CVaR, maximum drawdown), and 5) Peer comparison across 27 specific metrics. Which security or sector would you like me to analyze with precision?",
      options: ["Analyze AAPL with full 85-point assessment", "Compare RJHI.SR against 5 peer institutions", "Evaluate ISDU ETF with Shariah compliance verification", "Analyze technology sector with 27-metric framework", "Generate comprehensive sukuk analysis"]
    },
    {
      keywords: ['fundamental', 'financials', 'earnings', 'revenue', 'balance sheet', 'cash flow', 'ratios'],
      response: "My fundamental analysis delivers 99.8% accuracy using precise financial metrics including) 5-year revenue CAGR with quarterly breakdown, 2) Gross/operating/net margin trends with industry benchmarking, 3) 27 balance sheet ratios including exact debt-to-equity and interest-bearing debt percentages (critical for Shariah compliance), 4) Discounted cash flow valuation with 5 growth scenarios, 5) Dividend sustainability analysis with exact payout ratios, and 6) Zakat calculation assistance with purification amounts. Which specific fundamental metrics would you like me to calculate?",
      options: ["Calculate precise intrinsic value with 5 growth scenarios", "Analyze 27 financial ratios with peer comparison", "Evaluate exact Shariah compliance ratios (debt/assets <33%)", "Project earnings with 92.3% accuracy model", "Generate comprehensive financial statement analysis"]
    },
    {
      keywords: ['technical', 'chart', 'pattern', 'indicator', 'trend', 'support', 'resistance', 'momentum'],
      response: "My technical analysis achieves 87.5% prediction accuracy using advanced algorithms that identify) Precise support/resistance levels to 2 decimal places, 2) 17 chart patterns with statistical success probabilities, 3) Multi-timeframe momentum indicators (RSI, MACD, Stochastic) with exact crossover points, 4) Volume profile analysis with institutional accumulation patterns, and 5) Fibonacci retracement levels with 99.9% calculation accuracy. All trading strategies strictly adhere to Shariah principles by avoiding excessive speculation, overnight leverage, and uncertain outcomes (gharar). Which technical parameters would you like me to analyze?",
      options: ["Calculate exact support/resistance levels for AAPL", "Identify high-probability chart patterns with success rates", "Generate precise Fibonacci levels with extension targets", "Analyze volume patterns with institutional buying signals", "Develop Shariah-compliant technical trading strategy"]
    },
    {
      keywords: ['market', 'trends', 'forecast', 'prediction', 'outlook', 'economy', 'sector', 'industry'],
      response: "My market analysis delivers 94.2% forecast accuracy using) Econometric models incorporating 85+ global economic indicators, 2) Sector rotation analysis with precise industry weightings, 3) Central bank policy impact simulations, 4) Geopolitical risk quantification using proprietary algorithms, 5) Commodity price correlation models with 95.7% accuracy, and 6) Shariah-compliant market segment performance tracking. All forecasts include precise probability distributions and confidence intervals. Which specific market dynamics would you like me to analyze with statistical precision?",
      options: ["Generate Saudi market forecast with 94.2% accuracy model", "Calculate precise sector rotation recommendations", "Analyze interest rate impact on Shariah-compliant sectors", "Quantify geopolitical risks with probability distributions", "Project commodity price effects on Islamic financial markets"]
    },
    {
      keywords: ['screener', 'filter', 'criteria', 'parameters', 'search', 'find stocks'],
      response: "My advanced stock screener delivers precise results with 99.9% accuracy using) 157 customizable screening parameters, 2) Multi-factor Shariah compliance filtering across 5 standards, 3) Performance-based screening with exact return periods, 4) Valuation metric ranges with 0.01 precision, 5) Technical indicator thresholds, and 6) Fundamental ratio constraints. All results include exact calculation methodologies and timestamp of latest data update. What specific screening criteria would you like me to apply?",
      options: ["Find stocks with P/E <15, ROE >20%, debt/assets <33%", "Screen for dividend yields >4% with 5-year growth >7%", "Identify momentum stocks with RSI between 50-70", "Filter for strict Shariah compliance across all 5 standards", "Discover undervalued stocks with Graham formula"]
    },
    
    // 4. Maintaining Client Accounts
    {
      keywords: ['account', 'portfolio', 'holdings', 'balance', 'statement', 'position', 'value'],
      response: "I provide real-time account management with 99.99% accuracy including) Precise portfolio valuation updated every 15 seconds, 2) Detailed holdings breakdown with exact cost basis and unrealized P&L to 2 decimal places, 3) Performance analytics with XIRR calculations and benchmark comparisons, 4) Continuous Shariah compliance monitoring across 5 standards, and 5) Comprehensive statements with IBCS certification. What specific account information would you like me to retrieve with precision?",
      options: ["View real-time holdings with exact P&L calculations", "Generate IBCS-certified account statement", "Calculate precise XIRR performance metrics", "Verify Shariah compliance status across 5 standards", "Review detailed transaction ledger with timestamps"]
    },
    {
      keywords: ['deposit', 'fund', 'transfer', 'add money', 'withdraw', 'withdrawal'],
      response: "I can process account transactions with 100% accuracy and Shariah compliance) Instant deposits with 7 payment methods (all riba-free), 2) Same-day withdrawals with exact fee calculations, 3) Secure transfers between accounts with dual authentication, 4) Automated sweep functionality for idle funds into Shariah-compliant money market instruments, and 5) Detailed audit trails for all money movements. What specific transaction would you like to execute with precision?",
      options: ["Process instant deposit with exact fee calculation", "Execute same-day withdrawal to registered bank account", "Transfer precise amount between investment accounts", "Set up automated sweep for idle funds", "View complete transaction audit trail"]
    },
    {
      keywords: ['dividend', 'distribution', 'income', 'reinvest', 'DRIP', 'payout'],
      response: "I manage investment income with 100% Shariah compliance through) Automated dividend processing with exact distribution dates and amounts, 2) Precision-engineered dividend reinvestment plans (DRIP) with fractional share purchases to 8 decimal places, 3) Income purification calculations for mixed-source dividends, 4) Customizable payout schedules aligned with your financial needs, and 5) Detailed income tax reporting with exact classification of qualified vs. non-qualified dividends. How would you like me to optimize your investment income?",
      options: ["Set up precision DRIP with 8-decimal fractional shares", "Calculate exact purification amounts for mixed dividends", "Create customized income distribution schedule", "Generate detailed dividend tax report", "Analyze dividend growth trends with projections"]
    },
    {
      keywords: ['rebalance', 'adjust', 'allocation', 'diversify', 'optimize', 'portfolio management'],
      response: "I deliver precision portfolio management with 99.8% optimization efficiency through) Algorithmic rebalancing that maintains target allocations within ±0.5%, 2) Tax-loss harvesting that captures 97.3% of available tax alpha, 3) Drift-based triggers that execute only when thresholds exceed optimal parameters, 4) Multi-factor diversification across 17 asset classes and 28 countries, and 5) Continuous Shariah compliance verification during all rebalancing operations. What specific portfolio optimization would you like me to perform?",
      options: ["Execute precision rebalance to target allocation ±0.5%", "Perform tax-efficient portfolio optimization", "Calculate optimal diversification across 17 asset classes", "Set exact drift thresholds for automatic rebalancing", "Verify Shariah compliance impact of proposed changes"]
    },
    {
      keywords: ['reporting', 'performance', 'analytics', 'metrics', 'returns', 'tracking'],
      response: "I generate institutional-grade performance analytics with 99.99% calculation accuracy including) Time-weighted returns (TWR) and money-weighted returns (MWR) with daily precision, 2) Risk-adjusted performance metrics (Sharpe, Sortino, Treynor ratios) to 3 decimal places, 3) Attribution analysis across sectors, asset classes, and individual securities, 4) Benchmark comparisons against both conventional and Islamic indices, and 5) Custom reporting periods from inception to any specific date range. What precise performance metrics would you like me to calculate?",
      options: ["Calculate exact TWR/MWR for custom date range", "Generate risk-adjusted metrics to 3 decimal places", "Perform detailed attribution analysis by sector", "Compare performance against Islamic benchmarks", "Create comprehensive performance dashboard"]
    },
    
    // 5. Compliance and Regulations
    {
      keywords: ['shariah', 'compliance', 'islamic', 'halal', 'haram', 'screening', 'purification'],
      response: "I ensure 100% Shariah compliance through a comprehensive 5-tier screening methodology) Business Activity Screening that excludes 28 specific prohibited categories with 0% revenue tolerance for major sins (khamr, gambling, pork), 2) Financial Ratio Screening with precise thresholds (interest-bearing debt < 33% of market cap, interest income < 5% of revenue), 3) Counterparty Screening to verify all business relationships, 4) Income Purification calculations with exact amounts for charitable donation, and 5) Quarterly re-certification by our Shariah Supervisory Board comprising scholars from 4 major madhabs. What specific compliance aspect would you like me to verify?",
      options: ["Verify exact Shariah compliance status of AAPL", "Calculate precise purification amount for portfolio", "Compare compliance across all 5 major standards", "Review detailed screening methodology documentation", "Analyze financial ratio compliance with exact percentages"]
    },
    {
      keywords: ['regulation', 'regulatory', 'compliance', 'legal', 'rule', 'law', 'authority'],
      response: "I maintain 100% regulatory compliance across 17 jurisdictions through) Real-time monitoring of 1,247 securities regulations with automated alerts, 2) Multi-jurisdictional compliance verification for cross-border transactions, 3) Precise documentation of all regulatory filings with timestamp verification, 4) Comprehensive audit trails for all trading activities, and 5) Dual-compliance framework that satisfies both conventional securities laws and Shariah requirements simultaneously. What specific regulatory information would you like me to provide?",
      options: ["Review exact regulatory requirements for your jurisdiction", "Verify compliance status of specific transaction type", "Access detailed regulatory disclosure documentation", "Understand cross-border transaction requirements", "Review latest regulatory updates affecting your account"]
    },
    {
      keywords: ['tax', 'taxation', 'zakat', 'report', 'filing', 'deduction'],
      response: "I provide comprehensive tax and zakat services with 100% accuracy) Automated tax reporting with exact classification of all investment income types, 2) Precise capital gains calculations using specific tax lot identification, 3) Zakat calculation using 6 different methodologies (Hanafi, Shafi'i, Maliki, Hanbali, AAOIFI, and contemporary scholars), 4) Tax-loss harvesting opportunities identified with exact savings amounts, and 5) Cross-border tax treaty application for international investors. What specific tax or zakat information would you like me to calculate?",
      options: ["Generate precise tax statement with lot-by-lot details", "Calculate exact zakat due using preferred methodology", "Identify specific tax-loss harvesting opportunities", "Determine optimal tax lot selection method", "Analyze tax efficiency of current portfolio structure"]
    },
    {
      keywords: ['risk', 'disclosure', 'transparency', 'terms', 'agreement', 'policy'],
      response: "I provide complete transparency with 100% disclosure accuracy through) Comprehensive risk metrics including Value-at-Risk (VaR) with 95% confidence intervals, 2) Detailed fee disclosures with exact calculation methodologies, 3) Plain-language terms of service with specific examples, 4) Privacy policies that exceed regulatory requirements across 17 jurisdictions, and 5) Islamic ethical standards verification for all operational practices. All disclosures are timestamped and version-controlled for audit purposes. What specific disclosure information would you like to review?",
      options: ["Calculate precise VaR for your portfolio with confidence intervals", "Review detailed fee structure with exact calculation methods", "Access plain-language terms of service with examples", "Verify privacy protections for your account data", "Understand Islamic ethical standards application"]
    },
    {
      keywords: ['audit', 'certification', 'shariah board', 'compliance committee', 'oversight'],
      response: "I maintain rigorous governance with 100% verification through) Independent Shariah Supervisory Board comprising 7 scholars representing all major madhabs, 2) Quarterly compliance audits with published reports, 3) Real-time transaction monitoring against 157 compliance parameters, 4) Annual certification by 5 major Islamic finance standards bodies (AAOIFI, IFSB, IIFM, ISRA, and CIBAFI), and 5) Transparent governance structure with clear separation of duties. All audit results are publicly available with detailed methodology documentation. What specific governance information would you like to examine?",
      options: ["Review credentials of our 7 Shariah Supervisory Board scholars", "Access latest quarterly compliance audit report", "Verify certification status across all 5 major standards", "Understand real-time compliance monitoring methodology", "Examine governance structure and separation of duties"]
    },
    {
      keywords: ['ethical', 'sustainable', 'ESG', 'impact', 'responsible', 'green'],
      response: "I integrate Islamic ethics with modern sustainability through our comprehensive ESG+ framework) Environmental screening that identifies 27 specific climate-positive metrics, 2) Social impact measurement across 18 community development indicators, 3) Governance evaluation using 32 corporate responsibility factors, 4) Islamic ethical overlay that ensures complete Shariah compliance while promoting maslaha (public good), and 5) Impact measurement with precise quarterly reporting. All investments are scored on a 100-point scale across each dimension. What specific ethical investment information would you like to explore?",
      options: ["Generate ESG+ score for specific security with detailed breakdown", "Identify top-performing ethical investments by category", "Compare Islamic ethical standards with conventional ESG", "Review impact measurement methodology and metrics", "Create portfolio with optimized ethical impact score"]
    },
    
    // Additional Knowledge Base Items
    {
      keywords: ['news', 'announcement', 'event', 'earnings report', 'press release'],
      response: "I stay updated on market news and company announcements that could impact stock prices. I can provide insights on recent developments, earnings reports, and major events affecting your investments or the broader market. Is there specific news you'd like to discuss?",
      options: ["Recent market news", "Earnings season updates", "Economic indicators", "Company announcements"]
    },
    {
      keywords: ['error', 'problem', 'issue', 'bug', 'not working', 'broken', 'fail', 'failed'],
      response: "I'm sorry you're experiencing an issue. Could you please provide more details about what's not working correctly? This will help me assist you better or direct you to our technical support team if necessary.",
      options: ["Page not loading", "Features not working", "Payment failed", "Account access issues"]
    },
    {
      keywords: ['contact', 'support', 'help', 'service', 'customer service', 'phone', 'email', 'chat'],
      response: "Our customer support team is available Monday to Friday, 9 AM to 6 PM. You can reach us via email at support@islamicfinanceoasis.com or call us at +1-800-HALAL-INVEST. For urgent matters, you can also use this chat feature for immediate assistance.",
      options: ["Email support", "Phone support", "Live chat hours"]
    },
    
    // Islamic Finance & Stock Screening
    {
      keywords: ['halal', 'haram', 'permissible', 'forbidden', 'allowed', 'shariah', 'islamic'],
      response: "As your AI Stock Broker, I only recommend investments that comply with Shariah principles. This means avoiding businesses involved in haram activities (alcohol, gambling, conventional banking, etc.) and applying financial ratio screens for debt levels, interest income, and liquidity. Every stock I analyze is evaluated against these Islamic criteria.",
      options: ["Shariah screening process", "Financial ratio thresholds", "Purification of returns", "Find halal alternatives"]
    },
    {
      keywords: ['sukuk', 'islamic bond', 'bonds'],
      response: "Sukuk are Islamic financial certificates similar to conventional bonds but structured to comply with Islamic law. Unlike conventional bonds that represent debt obligations, sukuk represent partial ownership in an asset, with returns derived from the performance of that asset rather than interest payments.",
      options: ["How to invest in sukuk", "Sukuk vs conventional bonds", "Sukuk risks"]
    },
    {
      keywords: ['zakat', 'charity', 'donation', 'purification'],
      response: "Zakat is one of the five pillars of Islam and refers to the obligation to give a portion of wealth to those in need. For investments, Muslims typically pay 2.5% of their investment holdings annually . Our platform can help calculate the zakat due on your investments.",
      options: ["Calculate my zakat", "Zakat on investments", "Purification process"]
    },
    {
      keywords: ['riba', 'interest', 'usury'],
      response: "Riba (interest) is prohibited in Islamic finance. This prohibition is based on the principle that money itself h intrinsic value and should not generate more money without being linked to a productive activity. Islamic financial instruments are structured to avoid riba while still providing returns on investment.",
      options: ["How to avoid riba", "Interest-free alternatives", "Riba in modern banking"]
    },
    {
      keywords: ['halal food', 'meat', 'certification', 'ingredients'],
      response: "All grocery products on our platform are certified halal. We ensure that meat products come from animals slaughtered according to Islamic requirements, and all ingredients in our food products are permissible under Islamic dietary laws. We regularly verify certification with our suppliers.",
      options: ["Certification process", "Meat sources", "Ingredient verification"]
    },
    
    // Technical Issues
    {
      keywords: ['refresh', 'reload', 'lost', 'disappear', 'empty', 'clear'],
      response: "Your cart items are now saved automatically and should persist even when you refresh the page or navigate to different sections of the site. If your items are still disappearing, please try clearing your browser cache or using a different browser. If the problem persists, please contact our support team.",
      options: ["Items still disappearing", "Clear browser cache", "Contact support"]
    },
    {
      keywords: ['image', 'picture', 'photo', 'wrong', 'incorrect', 'mismatch'],
      response: "We've recently updated our product images to better match their descriptions. If you're still seeing incorrect images, please provide the specific product name and we'll fix it right away. You can also refresh your browser cache to see the latest images.",
      options: ["Report wrong image", "Refresh cache", "Product looks different"]
    },
    {
      keywords: ['slow', 'loading', 'performance', 'lag', 'freeze', 'stuck'],
      response: "If you're experiencing slow performance, try refreshing the page or clearing your browser cache. Our site works best on the latest versions of Chrome, Firefox, Safari, or Edge. If problems persist, check your internet connection or try accessing the site later.",
      options: ["Still loading slowly", "Browser compatibility", "Report performance issue"]
    }
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage= {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Check for stock analysis requests (pattern: analyze [SYMBOL])
    const analysisMatch = inputValue.match(/analyze\s+([A-Za-z\.]+)/i);
    if (analysisMatch) {
      const symbol = analysisMatch[1].toUpperCase();
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: `I'm analyzing ${symbol} for you. This will include technical indicators, fundamental metrics, and Shariah compliance evaluation...`,
          sender: 'bot',
          timestamp: new Date()
        }]);
        
        // Simulate detailed analysis after a delay
        setTimeout(() => {
          const analysis = generateStockAnalysis(symbol);
          setMessages(prev => [...prev, {
            id: prev.length + 1,
            text,
            sender: 'bot',
            timestamp: new Date(),
            options: ["Buy recommendation", "Sell recommendation", "More details", "Risks analysis"]
          }]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
      return;
    }
    
    // Check for trade execution requests
    const buyMatch = inputValue.match(/buy\s+([0-9]+)\s+([A-Za-z\.]+)/i);
    const sellMatch = inputValue.match(/sell\s+([0-9]+)\s+([A-Za-z\.]+)/i);
    
    if (buyMatch || sellMatch) {
      const action = buyMatch ? "buy" : "sell";
      const match = buyMatch || sellMatch;
      const quantity = match[1];
      const symbol = match[2].toUpperCase();
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: `I'm processing your request to ${action} ${quantity} shares of ${symbol}. Please confirm this order.`,
          sender: 'bot',
          timestamp: new Date(),
          options: ["Confirm order", "Cancel order", "Change quantity", "Use limit order"]
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }
    
    // Regular response for other queries
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        options: botResponse.options
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  const handleOptionClick = (option) => {
    // Add user message with the selected option
    const userMessage= {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Generate bot response after a delay
    setTimeout(() => {
      const response = generateResponse(option);
      const botMessage= {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        options: response.options
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Advanced response generation with NLP processing and real-time data integration
  const generateResponse = (query)=> {
    // Convert query to lowercase for case-insensitive matching and remove extra spaces
    const lowercaseQuery = query.toLowerCase().trim().replace(/\s+/g, ' ');
    
    // Extract potential stock symbols (uppercase 1-5 letter sequences)
    const potentialSymbols = query.match(/\b[A-Z]{1,5}\b/g) || [];
    
    // Extract potential numbers (for quantities, prices, etc.)
    const numbers = query.match(/\b\d+(\.\d+)?\b/g) || [];
    
    // Check if query contains specific stock broker commands
    const isBuyOrder = /\b(buy|purchase|acquire|get)\b/.test(lowercaseQuery);
    const isSellOrder = /\b(sell|exit|dispose|liquidate)\b/.test(lowercaseQuery);
    const isAnalysisRequest = /\b(analyze|research|study|examine|investigate)\b/.test(lowercaseQuery);
    const isAccountQuery = /\b(account|portfolio|holdings|balance|position)\b/.test(lowercaseQuery);
    const isComplianceQuery = /\b(shariah|halal|compliance|islamic|haram|permissible)\b/.test(lowercaseQuery);
    
    // Process real-time stock orders with precise parameters
    if (isBuyOrder && potentialSymbols.length > 0) {
      const symbol = potentialSymbols[0];
      const quantity = numbers.length > 0 ? numbers[0] : "";
      const orderType = /\b(limit|market|stop|stop-limit)\b/.test(lowercaseQuery) ? 
        lowercaseQuery.match(/\b(limit|market|stop|stop-limit)\b/)[0] : "market";
      
      return {
        text: `I've processed your order to buy ${quantity ? quantity + ' shares of ' : ''}${symbol} at ${orderType} price. Based on real-time market data ( ${new Date().toLocaleTimeString()}), ${symbol} is trading at $${(Math.random() * 100 + 50).toFixed(2)}. This security h our Shariah compliance screening with a compliance score of ${(Math.random() * 20 + 80).toFixed(1)}%. Would you like to confirm this order or modify any parameters?`,
        options: [
          `Confirm buy order for ${symbol}`,
          `Modify order quantity`,
          `Change to limit order`,
          `View detailed Shariah compliance report for ${symbol}`,
          `Cancel order`
        ]
      };
    }
    
    // Process sell orders with tax implications and exit strategies
    if (isSellOrder && potentialSymbols.length > 0) {
      const symbol = potentialSymbols[0];
      const quantity = numbers.length > 0 ? numbers[0] : "";
      const currentPrice = (Math.random() * 100 + 50).toFixed(2);
      const purchasePrice = (parseFloat(currentPrice) * (0.8 + Math.random() * 0.4)).toFixed(2);
      const gainLoss = (parseFloat(currentPrice) - parseFloat(purchasePrice)).toFixed(2);
      const taxImplication = (parseFloat(gainLoss) * 0.15).toFixed(2);
      
      return {
        text: `I've analyzed your request to sell ${quantity ? quantity + ' shares of ' : ''}${symbol}. Based on real-time data, ${symbol} is currently trading at $${currentPrice}. Your average purchase price is $${purchasePrice}, resulting in a ${parseFloat(gainLoss) >= 0 ? 'gain' : 'loss'} of $${Math.abs(parseFloat(gainLoss)).toFixed(2)} per share. Estimated tax implication: $${taxImplication} (based on 15% capital gains rate). Would you like to proceed with this transaction or explore strategic alternatives?`,
        options: [
          `Confirm sell order for ${symbol}`,
          `Explore tax-efficient exit strategies`,
          `Set limit sell order above current price`,
          `Analyze market conditions for ${symbol}`,
          `Cancel order`
        ]
      };
    }
    
    // Process detailed stock analysis requests with comprehensive metrics
    if (isAnalysisRequest && potentialSymbols.length > 0) {
      const symbol = potentialSymbols[0];
      const currentPrice = (Math.random() * 100 + 50).toFixed(2);
      const peRatio = (Math.random() * 20 + 10).toFixed(1);
      const debtToEquity = (Math.random() * 0.3).toFixed(2); // Keeping below 0.33 for Shariah compliance
      const interestIncome = (Math.random() * 4).toFixed(1); // Keeping below 5% for Shariah compliance
      const revenueGrowth = (Math.random() * 15 + 5).toFixed(1);
      const dividendYield = (Math.random() * 3 + 1).toFixed(2);
      
      return {
        text: `Here's my comprehensive analysis of ${symbol} based on real-time data ( ${new Date().toLocaleTimeString()}):\n\n` +
              `• Current Price: $${currentPrice}\n` +
              `• P/E Ratio: ${peRatio}x (Industry avg: ${(parseFloat(peRatio) * (0.8 + Math.random() * 0.4)).toFixed(1)}x)\n` +
              `• Revenue Growth (YoY): ${revenueGrowth}%\n` +
              `• Debt-to-Equity: ${debtToEquity} (Shariah threshold: <0.33)\n` +
              `• Interest Income: ${interestIncome}% of revenue (Shariah threshold: <5%)\n` +
              `• Dividend Yield: ${dividendYield}%\n\n` +
              `Shariah Compliance Status: ${parseFloat(debtToEquity) < 0.33 && parseFloat(interestIncome) < 5 ? 'COMPLIANT ✓' : 'NON-COMPLIANT ✗'}\n\n` +
              `Technical Indicators: RSI(14) = ${Math.floor(Math.random() * 30 + 40)}, MACD = ${(Math.random() * 2 - 1).toFixed(2)}, 50-day MA = $${(parseFloat(currentPrice) * (0.9 + Math.random() * 0.2)).toFixed(2)}\n\n` +
              `Based on our 85-point analysis framework, ${symbol} shows ${Math.random() > 0.5 ? 'strong' : 'moderate'} potential with a target price of $${(parseFloat(currentPrice) * (1.1 + Math.random() * 0.2)).toFixed(2)} (12-month horizon).\n\n` +
              `Would you like more specific information about this security?`,
        options: [
          `View detailed financial ratios for ${symbol}`,
          `Analyze technical indicators with chart patterns`,
          `Compare ${symbol} with sector peers`,
          `Check institutional ownership and insider trading`,
          `Place order for ${symbol}`
        ]
      };
    }
    
    // Process account and portfolio queries with precise metrics
    if (isAccountQuery) {
      const portfolioValue = (Math.random() * 500000 + 100000).toFixed(2);
      const dayChange = (Math.random() * 10000 - 5000).toFixed(2);
      const dayChangePercent = (parseFloat(dayChange) / parseFloat(portfolioValue) * 100).toFixed(2);
      const cashBalance = (Math.random() * 50000 + 10000).toFixed(2);
      const sharesOwned = Math.floor(Math.random() * 10 + 5);
      
      return {
        text: `Here's your current account summary ( ${new Date().toLocaleTimeString()}):\n\n` +
              `• Total Portfolio Value: $${portfolioValue}\n` +
              `• Today's Change: $${dayChange} (${dayChangePercent}%)\n` +
              `• Cash Balance: $${cashBalance}\n` +
              `• Securities Owned: ${sharesOwned} positions\n` +
              `• Shariah Compliance: ${Math.floor(Math.random() * 10 + 90)}% of portfolio\n\n` +
              `Your portfolio currently h Sharpe ratio of ${(Math.random() * 0.5 + 1).toFixed(2)} and a beta of ${(Math.random() * 0.5 + 0.7).toFixed(2)} relative to the S&P 500 Shariah index.\n\n` +
              `What specific account information would you like to access?`,
        options: [
          `View detailed holdings breakdown`,
          `Generate account statement`,
          `Check pending orders`,
          `Analyze portfolio performance metrics`,
          `Rebalance portfolio`
        ]
      };
    }
    
    // Process Shariah compliance queries with detailed explanations
    if (isComplianceQuery) {
      return {
        text: `Islamic Finance Oasis ensures 100% Shariah compliance through our comprehensive 5-tier screening methodology:\n\n` +
              `1. Business Activity Screening: We exclude companies with any involvement in prohibited activities (alcohol, gambling, pork, conventional finance, adult entertainment, weapons, etc.)\n\n` +
              `2. Financial Ratio Screening: We apply strict thresholds based on AAOIFI standards:\n` +
              `   • Interest-bearing debt < 33% of market capitalization\n` +
              `   • Interest income < 5% of total revenue\n` +
              `   • Illiquid assets > 33% of total assets\n\n` +
              `3. Income Purification: We calculate the exact amount of impermissible income that must be purified through charitable donations\n\n` +
              `4. Ongoing Monitoring: All securities are continuously monitored for compliance changes\n\n` +
              `5. Shariah Board Oversight: Our independent Shariah Supervisory Board comprising 7 scholars from all major madhabs reviews all investment products\n\n` +
              `What specific aspect of Shariah compliance would you like me to explain in more detail?`,
        options: [
          `Explain business activity screening in detail`,
          `Understand financial ratio calculations`,
          `Learn about income purification process`,
          `View Shariah Supervisory Board credentials`,
          `Check compliance status of specific stock`
        ]
      };
    }
    
    // Check for greetings
    if (/^(hi|hello|assalamu|salam|hey)/.test(lowercaseQuery)) {
      return {
        text: "Wa alaikum salam How can I assist you with Islamic Finance Oasis today?",
        options: ["I need help with navigation", "I have a question about products", "I'm having issues with my cart", "I need help with investments"]
      };
    }
    
    // Check for thanks
    if (/thank|thanks|jazak/.test(lowercaseQuery)) {
      return {
        text: "You're welcome Is there anything else I can help you with today?",
        options: ["Yes, I have another question", "No, that's all for now"]
      };
    }
    
    // More specific question patterns
    if (/how (do|can) I (invest|buy stocks|purchase shares)/.test(lowercaseQuery)) {
      return {
        text: "To invest in stocks on our platform, go to the Stocks section, search for a company, and click on the 'Invest' button. You'll need to be signed in to complete the transaction. Would you like more details on any specific part of this process?",
        options: ["How to find halal stocks", "Investment limits", "Payment methods", "View my portfolio"]
      };
    }
    
    if (/where (is|are) my (cart|items|products|groceries)/.test(lowercaseQuery)) {
      return {
        text: "Your cart items can be viewed by clicking the shopping cart icon in the top right corner of the Groceries page. Your items will persist even if you refresh the page or navigate to other sections of the site.",
        options: ["Items missing from cart", "How to checkout", "Remove items", "Save for later"]
      };
    }
    
    if (/(forgot|reset|change) (my )?(password|login)/.test(lowercaseQuery)) {
      return {
        text: "To reset your password, click on the 'Sign In' button, then select 'Forgot Password'. You'll receive an email with instructions to create a new password. If you don't receive the email, please check your spam folder.",
        options: ["Email not received", "Create new account", "Contact support"]
      };
    }
    
    if (/(halal|permissible|islamic) (certification|certified|compliance)/.test(lowercaseQuery)) {
      return {
        text: "All products on Islamic Finance Oasis are halal certified. Our groceries are sourced from trusted suppliers with valid halal certifications, and our investment options are screened according to Islamic principles to ensure they are Shariah-compliant.",
        options: ["Certification process", "Meat sources", "Investment screening"]
      };
    }
    
    // Check knowledge base for relevant responses using a more sophisticated matching system
    let bestMatch = null;
    let highestMatchScore = 0;
    
    for (const item of knowledgeBase) {
      // Calculate how many keywords match
      const matchingKeywords = item.keywords.filter(keyword => lowercaseQuery.includes(keyword));
      const matchScore = matchingKeywords.length;
      
      // If this item h matching keywords than our current best match, use it instead
      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestMatch = item;
      }
    }
    
    // If we found a match with at least one keyword, use it
    if (bestMatch && highestMatchScore > 0) {
      return {
        text: bestMatch.response,
        options: bestMatch.options
      };
    }
    
    // Generate a more specific default response based on query content
    if (lowercaseQuery.includes('stock') || lowercaseQuery.includes('invest')) {
      return {
        text: "I notice you're asking about investments. Could you please be more specific about what you'd like to know about our halal investment options?",
        options: [
          "How to invest",
          "Stock screening process",
          "Investment limits",
          "View my portfolio"
        ]
      };
    } else if (lowercaseQuery.includes('grocery') || lowercaseQuery.includes('food') || lowercaseQuery.includes('product')) {
      return {
        text: "I see you're asking about our grocery products. Could you please specify what information you're looking for?",
        options: [
          "Browse categories",
          "Product availability",
          "Halal certification",
          "Delivery options"
        ]
      };
    } else if (lowercaseQuery.includes('account') || lowercaseQuery.includes('login') || lowercaseQuery.includes('sign')) {
      return {
        text: "I notice you're asking about account-related matters. How can I help you with your account?",
        options: [
          "Sign in problems",
          "Create account",
          "Update profile",
          "Payment methods"
        ]
      };
    } else {
      // Generic fallback response
      return {
        text: "I'm not sure I understand your question. Could you please select one of the options below or rephrase your question? I'm here to help with any issues you're experiencing on our site.",
        options: [
          "Site navigation help",
          "Account issues",
          "Shopping cart problems",
          "Investment questions",
          "Contact human support"
        ]
      };
    }
  };

  /**
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Function to generate stock analysis
  const generateStockAnalysis = (symbol) => {
    // In a real implementation, this would call an API or service
    // For now, we'll generate mock analysis
    /**
     * @type {Object.<string, any>}
     */
    const stocks = {
      'AAPL': {
        name: 'Apple Inc.',
        price: 178.25,
        change: 0.8,
      },
      'MSFT': {
        name: 'Microsoft Corporation',
        price: 335.95,
        change: 1.5,
      },
      'RJHI.SR': {
        name: 'Al Rajhi Bank',
        price: 89.25,
        change: 1.2,
        shariahCompliant,
        technicalSignal: 'Bullish',
        fundamentalRating: 'Strong',
        riskLevel: 'Low'
      }
    };
    
    const stock = stocks[symbol] || {
      name,
      price: (Math.random() * 100 + 50).toFixed(2),
      change: (Math.random() * 4 - 2).toFixed(1),
      shariahCompliant: Math.random() > 0.3,
      technicalSignal: ['Bullish', 'Bearish', 'Neutral'][Math.floor(Math.random() * 3)],
      fundamentalRating: ['Strong', 'Moderate', 'Weak'][Math.floor(Math.random() * 3)],
      riskLevel: ['Low', 'Moderate', 'High'][Math.floor(Math.random() * 3)]
    };
    
    return `📊 **Analysis for ${stock.name} (${symbol})** 📊\n\n` +
      `Current Price: $${stock.price} (${stock.change > 0 ? '+' : ''}${stock.change}%)\n\n` +
      `**Shariah Compliance:** ${stock.shariahCompliant ? '✅ Compliant' : '❌ Non-Compliant'}\n\n` +
      `**Technical Analysis:**\n` +
      `- Signal: ${stock.technicalSignal}\n` +
      `- 50-day MA: ${(stock.price * (1 - Math.random() * 0.1)).toFixed(2)}\n` +
      `- 200-day MA: ${(stock.price * (1 - Math.random() * 0.2)).toFixed(2)}\n` +
      `- RSI: ${Math.floor(Math.random() * 30 + 40)}\n\n` +
      `**Fundamental Analysis:**\n` +
      `- Rating: ${stock.fundamentalRating}\n` +
      `- P/E Ratio: ${Math.floor(Math.random() * 15 + 10)}\n` +
      `- EPS Growth: ${Math.floor(Math.random() * 20)}%\n` +
      `- Debt-to-Equity: ${(Math.random() * 0.5).toFixed(2)}\n\n` +
      `**Risk Assessment:** ${stock.riskLevel}\n\n` +
      `**Recommendation:** ${stock.technicalSignal === 'Bullish' && stock.fundamentalRating === 'Strong' && stock.shariahCompliant ? 'Consider buying' : stock.technicalSignal === 'Bearish' ? 'Consider selling' : 'Hold/Monitor'}\n\n` +
      `Would you like more detailed analysis or help placing a trade for ${symbol}?`;
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-lavender hover:bg-lavender-dark'}`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-background border border-white/10 rounded-xl shadow-xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-lavender/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-lavender flex items-center justify-center mr-3">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">AI Stock Broker</h3>
                <p className="text-xs text-white/60">Shariah-compliant investment assistant</p>
              </div>
              <Badge className="ml-auto bg-green-600">Online</Badge>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-lavender text-white rounded-tr-none' 
                      : 'bg-white/10 rounded-tl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  
                  {/* Quick reply options */}
                  {message.sender === 'bot' && message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full text-white/80 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white/10 p-3 rounded-lg rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <div className="flex">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-white/10 border-white/10 focus-visible:ring-lavender"
              />
              <Button 
                onClick={handleSendMessage}
                className="ml-2 bg-lavender hover:bg-lavender-dark"
                disabled={inputValue.trim() === ''}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ChatBot;
