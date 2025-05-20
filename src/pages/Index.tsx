import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedCard from "@/components/FeaturedCard";
import StockCard from "@/components/StockCard";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // Mock data for featured stocks
  const featuredStocks = [
    {
      name: "Al Rajhi Bank",
      symbol: "RJHI.SR",
      price: 89.25,
      change: 1.2,
      status: "halal" as const,
      description: "Islamic banking and investment products"
    },
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      price: 172.50,
      change: -0.8,
      status: "halal" as const,
      description: "Technology and consumer electronics"
    },
    {
      name: "Nestlé S.A.",
      symbol: "NESN.SW",
      price: 104.32,
      change: 0.5,
      status: "halal" as const,
      description: "Food and beverage products"
    }
  ];



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lavender/20 via-background to-background z-0"></div>
        {/* AI Neural Network Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Data Points */}
          {[...Array(30)].map((_, i) => (
            <div 
              key={`node-${i}`}
              className="absolute rounded-full bg-lavender/40 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: Math.random() * 0.5 + 0.2,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
          
          {/* Neural Connections */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9b87f5" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#9b87f5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#9b87f5" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {[...Array(15)].map((_, i) => {
              const x1 = Math.random() * 100;
              const y1 = Math.random() * 100;
              const x2 = Math.random() * 100;
              const y2 = Math.random() * 100;
              return (
                <line 
                  key={`connection-${i}`}
                  x1={`${x1}%`} 
                  y1={`${y1}%`} 
                  x2={`${x2}%`} 
                  y2={`${y2}%`} 
                  stroke="url(#connection-gradient)"
                  strokeWidth="1"
                  className="animate-draw-line"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              );
            })}
          </svg>
          
          {/* AI-Powered Investment Symbols */}
          <div className="absolute top-[15%] left-[20%] animate-float-slow opacity-40">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22H22" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.2s' }}/>
              <path d="M12 6L7 11L10 14L4 20" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.4s' }}/>
              <path d="M12 6L17 11L14 14L20 20" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.6s' }}/>
              <path d="M12 6V2" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.8s' }}/>
            </svg>
          </div>
          
          <div className="absolute top-[25%] right-[25%] animate-float-medium opacity-40" style={{ animationDelay: '1.5s' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.3s' }}/>
              <path d="M2 17L12 22L22 17" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.6s' }}/>
              <path d="M2 12L12 17L22 12" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '0.9s' }}/>
            </svg>
          </div>
          
          <div className="absolute bottom-[30%] left-[30%] animate-float-fast opacity-40" style={{ animationDelay: '0.7s' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#9b87f5" strokeWidth="1.5" className="animate-draw-line" style={{ animationDelay: '0.2s' }}/>
              <path d="M12 6V12L16 14" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" style={{ animationDelay: '1s' }}/>
            </svg>
          </div>
          
          {/* AI Processing Elements */}
          <div className="absolute bottom-[20%] right-[20%] opacity-40">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="2" stroke="#9b87f5" strokeWidth="1.5" className="animate-draw-line" style={{ animationDelay: '0.5s' }}/>
              <path d="M7 7L17 17" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" className="animate-draw-line" style={{ animationDelay: '1s' }}/>
              <path d="M17 7L7 17" stroke="#9b87f5" strokeWidth="1.5" strokeLinecap="round" className="animate-draw-line" style={{ animationDelay: '1.5s' }}/>
              <circle cx="12" cy="12" r="4" stroke="#9b87f5" strokeWidth="1.5" className="animate-pulse-slow"/>
            </svg>
          </div>
          
          <div className="absolute bottom-[20%] right-[15%] animate-float-medium opacity-30" style={{ animationDelay: '2s' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H21" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H21" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 18H21" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H3.01" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12H3.01" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 18H3.01" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          {/* AI/Data visualization elements */}
          <div className="absolute top-[40%] left-[10%] opacity-20">
            <div className="w-[100px] h-[60px] flex items-end justify-around">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={`bar-${i}`}
                  className="w-3 bg-lavender rounded-t-sm animate-bar-chart"
                  style={{ 
                    height: `${Math.random() * 30 + 10}px`,
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="absolute top-[60%] right-[20%] opacity-20">
            <div className="w-[80px] h-[80px] rounded-full border-2 border-lavender/50 flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full border-2 border-lavender/70 flex items-center justify-center animate-pulse-slow">
                <div className="w-[40px] h-[40px] rounded-full border-2 border-lavender animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Stock chart line */}
          <div className="absolute bottom-[40%] left-[40%] opacity-30">
            <svg width="150" height="60" viewBox="0 0 150 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0,40 C10,35 20,45 30,30 C40,15 50,10 60,25 C70,40 80,45 90,35 C100,25 110,15 120,10 C130,5 140,15 150,5" 
                stroke="#9b87f5" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-draw-line"
              />
              <circle cx="30" cy="30" r="3" fill="#9b87f5" className="animate-pulse-slow" style={{ animationDelay: '1s' }} />
              <circle cx="90" cy="35" r="3" fill="#9b87f5" className="animate-pulse-slow" style={{ animationDelay: '2s' }} />
              <circle cx="120" cy="10" r="3" fill="#9b87f5" className="animate-pulse-slow" style={{ animationDelay: '3s' }} />
            </svg>
          </div>
          
          {/* Coin stack animation */}
          <div className="absolute top-[70%] right-[40%] opacity-30">
            <div className="relative w-[40px] h-[60px]">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={`coin-${i}`}
                  className="absolute w-[30px] h-[30px] rounded-full border-2 border-lavender bg-lavender/10 left-1/2 -translate-x-1/2 animate-float-coin"
                  style={{ 
                    bottom: `${i * 6}px`,
                    animationDelay: `${i * 0.2}s`,
                    zIndex: 5 - i
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-lavender">$</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI brain visualization */}
          <div className="absolute top-[20%] left-[40%] opacity-20">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="#9b87f5" strokeWidth="1" opacity="0.3" />
              <path className="animate-pulse-glow" d="M12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17Z" stroke="#9b87f5" strokeWidth="1" />
              <path className="animate-rotate-cw" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2" stroke="#9b87f5" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 2" />
              <path d="M8 12L10 14L14 10" stroke="#9b87f5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-check" />
            </svg>
          </div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gradient">
              Ethical Investments
              <span className="block text-lavender">Powered by AI</span>
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Experience the future of Shariah-compliant investing with our AI-powered platform. Make informed decisions while staying true to your values.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/account">
                  <Button 
                    size="lg"
                    className="bg-lavender hover:bg-lavender-dark text-white font-medium" 
                  >
                    My Account
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button 
                    size="lg"
                    className="bg-lavender hover:bg-lavender-dark text-white font-medium" 
                  >
                    Create Account
                  </Button>
                </Link>
              )}
              <Button 
                size="lg"
                variant="outline" 
                className="border-lavender text-lavender hover:bg-lavender/20"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-lavender/10 animate-pulse-glow blur-xl"></div>
        <div className="absolute bottom-10 right-[10%] w-40 h-40 rounded-full bg-lavender/5 animate-pulse-glow blur-xl" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-[30%] right-[5%] w-32 h-32 rounded-full bg-lavender/10 animate-pulse-glow blur-xl" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-[20%] left-[15%] w-36 h-36 rounded-full bg-lavender/8 animate-pulse-glow blur-xl" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-[15%] left-[30%] w-20 h-20 rounded-full bg-lavender/5 animate-pulse-glow blur-xl" style={{ animationDelay: "0.5s" }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Our Ethical Investment Ecosystem</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              ZaryahX leverages AI technology to provide a comprehensive ethical investment platform aligned with Shariah principles, helping you make financially sound and morally conscious decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeaturedCard
              title="Halal Stocks"
              description="Invest in pre-vetted companies that comply with Shariah principles, free from interest, gambling, and other haram activities."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-lavender">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>}
              linkTo="/stocks"
              variant="primary"
            />
            <FeaturedCard
              title="Stock Analysis"
              description="Search for any stock to analyze its Shariah compliance through our advanced AI-powered screening technology."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-lavender">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>}
              linkTo="/analysis"
            />

          </div>
        </div>
      </section>

      {/* Trending Stocks Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gradient">Trending Halal Stocks</h2>
            <Button 
              variant="ghost"
              className="text-lavender hover:bg-lavender/10 flex items-center"
              asChild
            >
              <a href="/stocks">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStocks.map((stock, index) => (
              <StockCard
                key={index}
                name={stock.name}
                symbol={stock.symbol}
                price={stock.price}
                change={stock.change}
                status={stock.status}
                description={stock.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Halal Certification Benefits */}
      <section className="py-20 bg-secondary/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-lavender/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gradient">Why Choose Halal Investments?</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 bg-lavender/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg mb-1">Shariah Compliance</h3>
                    <p className="text-white/70">All investments are rigorously screened for adherence to Islamic principles, avoiding interest (riba), gambling (maysir), and other haram activities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 bg-lavender/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg mb-1">Ethical Considerations</h3>
                    <p className="text-white/70">Investments exclude companies dealing with alcohol, tobacco, adult entertainment, and other prohibited industries.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mt-1 bg-lavender/20 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg mb-1">Financial Purification</h3>
                    <p className="text-white/70">Regular zakat calculations and purification processes ensure that your investments remain halal over time.</p>
                  </div>
                </div>
              </div>
              <Button 
                className="mt-8 bg-lavender hover:bg-lavender-dark text-white"
                asChild
              >
                <a href="/analysis">Analyze Your Portfolio</a>
              </Button>
            </div>
            <div className="lg:pl-12 relative">
              <div className="p-6 glassy-card rounded-2xl">
                <div className="rounded-lg overflow-hidden">
                  <div className="bg-lavender/10 h-64 w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-lavender mb-4">100%</div>
                      <div className="text-xl font-medium">Shariah Compliant</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Interest-free</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-lavender to-lavender-light rounded-full w-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">No prohibited industries</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-lavender to-lavender-light rounded-full w-full"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Financial transparency</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-lavender to-lavender-light rounded-full w-full"></div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 w-12 h-12 bg-lavender/20 rounded-full animate-pulse-glow"></div>
              <div className="absolute -left-10 -bottom-10 w-20 h-20 bg-lavender/10 rounded-full animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-lavender/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lavender/20 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gradient">Join the ZaryahX Community</h2>
            <p className="text-xl text-white/70 mb-8">
              Start your halal investment journey today and align your finances with your faith.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/account">
                  <Button 
                    size="lg"
                    className="bg-lavender hover:bg-lavender-dark text-white font-medium" 
                  >
                    My Account
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button 
                    size="lg"
                    className="bg-lavender hover:bg-lavender-dark text-white font-medium" 
                  >
                    Create Account
                  </Button>
                </Link>
              )}
              <Button 
                size="lg"
                variant="outline" 
                className="border-lavender text-lavender hover:bg-lavender/20"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
        {/* Animated Background Elements */}
        <div className="absolute top-[20%] left-[5%] w-32 h-32 rounded-full bg-lavender/5 animate-pulse-glow"></div>
        <div className="absolute bottom-[10%] right-[10%] w-48 h-48 rounded-full bg-lavender/5 animate-pulse-glow" style={{ animationDelay: "0.5s" }}></div>
      </section>

      <Footer />

    </div>
  );
};
export default Index;