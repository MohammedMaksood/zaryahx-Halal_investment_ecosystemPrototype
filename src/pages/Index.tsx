
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedCard from "@/components/FeaturedCard";
import StockCard from "@/components/StockCard";
import GroceryCard from "@/components/GroceryCard";

const Index = () => {
  // Mock data
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

  const featuredGroceries = [
    {
      name: "Premium Halal Beef",
      category: "Meat & Poultry",
      price: 15.99,
      rating: 4.8,
      featured: true
    },
    {
      name: "Organic Basmati Rice",
      category: "Grains",
      price: 9.99,
      rating: 4.7,
      featured: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-lavender/20 via-background to-background z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gradient">
              Halal Investments for a Blessed Future
            </h1>
            <p className="text-xl text-white/70 mb-8">
              ZaryahX provides a comprehensive ecosystem for halal investments, Islamic education, and halal groceries - all guided by Shariah principles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-lavender hover:bg-lavender-dark text-white font-medium" 
              >
                Create Account
              </Button>
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
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-lavender/10 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-[10%] w-32 h-32 rounded-full bg-lavender/5 animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-[30%] right-[5%] w-16 h-16 rounded-full bg-lavender/10 animate-pulse-glow" style={{ animationDelay: "1.5s" }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Our Islamic Investment Ecosystem</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              ZaryahX provides a complete halal ecosystem for Muslims seeking to align their finances and lifestyle with Islamic principles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>}
              linkTo="/analysis"
            />
            <FeaturedCard
              title="Islamic Academics"
              description="Find nearby Islamic schools, colleges, masjids, and coaching centers to nurture your spiritual and educational growth."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-lavender">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>}
              linkTo="/academics"
            />
            <FeaturedCard
              title="Halal Groceries"
              description="Shop for halal-certified food products and groceries with our curated marketplace of trusted vendors."
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-lavender">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>}
              linkTo="/groceries"
              variant="accent"
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
                    <p className="text-white/70">All investments are rigorously screened for adherence to Islamic principles, avoiding interest (riba), gambling (maysir), and uncertainty (gharar).</p>
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

      {/* Featured Groceries */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gradient">Featured Halal Groceries</h2>
            <Button 
              variant="ghost"
              className="text-lavender hover:bg-lavender/10 flex items-center"
              asChild
            >
              <a href="/groceries">
                Browse All <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredGroceries.map((grocery, index) => (
              <GroceryCard
                key={index}
                name={grocery.name}
                category={grocery.category}
                price={grocery.price}
                rating={grocery.rating}
                featured={grocery.featured}
              />
            ))}
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
              <Button 
                size="lg"
                className="bg-lavender hover:bg-lavender-dark text-white font-medium" 
              >
                Create Account
              </Button>
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
