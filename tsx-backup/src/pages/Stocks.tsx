
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StockCard from "@/components/StockCard";
import LoadingAnimation from "@/components/LoadingAnimation";

const Stocks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Mock data
  const halalStocks = [
    // Technology Stocks (7)
    {
      name: "Alibaba Group",
      symbol: "BABA",
      price: 87.15,
      change: -1.2,
      status: "halal" as const,
      description: "E-commerce and cloud computing",
      category: "technology"
    },
    {
      name: "Apple Inc.",
      symbol: "AAPL",
      price: 172.50,
      change: -0.8,
      status: "halal" as const,
      description: "Technology and consumer electronics",
      category: "technology"
    },
    {
      name: "Microsoft Corp.",
      symbol: "MSFT",
      price: 337.18,
      change: 1.7,
      status: "halal" as const,
      description: "Software, cloud computing, and hardware",
      category: "technology"
    },
    {
      name: "Salesforce Inc.",
      symbol: "CRM",
      price: 242.65,
      change: 2.1,
      status: "halal" as const,
      description: "Cloud-based software services",
      category: "technology"
    },
    {
      name: "SAP SE",
      symbol: "SAP",
      price: 178.32,
      change: 0.9,
      status: "halal" as const,
      description: "Enterprise software and solutions",
      category: "technology"
    },
    {
      name: "ASML Holding",
      symbol: "ASML",
      price: 892.45,
      change: 3.2,
      status: "halal" as const,
      description: "Semiconductor equipment manufacturing",
      category: "technology"
    },
    {
      name: "Taiwan Semiconductor",
      symbol: "TSM",
      price: 142.78,
      change: 1.5,
      status: "halal" as const,
      description: "Semiconductor manufacturing",
      category: "technology"
    },
    
    // Finance Stocks (6)
    {
      name: "Al Rajhi Bank",
      symbol: "RJHI.SR",
      price: 89.25,
      change: 1.2,
      status: "halal" as const,
      description: "Islamic banking and investment products",
      category: "finance"
    },
    {
      name: "Qatar National Bank",
      symbol: "QNBK.QA",
      price: 18.90,
      change: 0.6,
      status: "halal" as const,
      description: "Banking and financial services",
      category: "finance"
    },
    {
      name: "Dubai Islamic Bank",
      symbol: "DIB.DU",
      price: 5.42,
      change: 0.3,
      status: "halal" as const,
      description: "Islamic banking and financial services",
      category: "finance"
    },
    {
      name: "Bank Nizwa",
      symbol: "BKNZ.OM",
      price: 0.098,
      change: 0.5,
      status: "halal" as const,
      description: "Shariah-compliant banking services",
      category: "finance"
    },
    {
      name: "Amanah Leasing",
      symbol: "AMANAH.BK",
      price: 22.45,
      change: -0.2,
      status: "halal" as const,
      description: "Islamic leasing and financing",
      category: "finance"
    },
    {
      name: "Maybank Islamic",
      symbol: "MAYBANK.KL",
      price: 8.75,
      change: 0.4,
      status: "halal" as const,
      description: "Islamic banking arm of Maybank",
      category: "finance"
    },
    
    // Consumer Stocks (6)
    {
      name: "Nestlé S.A.",
      symbol: "NESN.SW",
      price: 104.32,
      change: 0.5,
      status: "halal" as const,
      description: "Food and beverage products",
      category: "consumer"
    },
    {
      name: "Unilever PLC",
      symbol: "UL",
      price: 52.18,
      change: 0.7,
      status: "halal" as const,
      description: "Consumer goods and personal care",
      category: "consumer"
    },
    {
      name: "Savola Group",
      symbol: "SAVOLA.SR",
      price: 24.86,
      change: -0.3,
      status: "halal" as const,
      description: "Food products and retail",
      category: "consumer"
    },
    {
      name: "Almarai Co.",
      symbol: "ALMARAI.SR",
      price: 56.90,
      change: 1.1,
      status: "halal" as const,
      description: "Dairy and food products",
      category: "consumer"
    },
    {
      name: "BRF S.A.",
      symbol: "BRFS",
      price: 3.25,
      change: -0.1,
      status: "halal" as const,
      description: "Halal-certified poultry and processed foods",
      category: "consumer"
    },
    {
      name: "Carrefour SA",
      symbol: "CA.PA",
      price: 16.78,
      change: 0.2,
      status: "halal" as const,
      description: "Retail and supermarkets",
      category: "consumer"
    },
    
    // Real Estate Stocks (5)
    {
      name: "Jabal Omar Development",
      symbol: "JOMAR.SR",
      price: 27.65,
      change: 0.8,
      status: "halal" as const,
      description: "Real estate development in Makkah",
      category: "realestate"
    },
    {
      name: "Emaar Properties",
      symbol: "EMAAR.DU",
      price: 6.78,
      change: 1.3,
      status: "halal" as const,
      description: "Real estate development and management",
      category: "realestate"
    },
    {
      name: "Dar Al Arkan",
      symbol: "ALARKAN.SR",
      price: 8.92,
      change: -0.5,
      status: "halal" as const,
      description: "Real estate development in Saudi Arabia",
      category: "realestate"
    },
    {
      name: "IGB REIT",
      symbol: "IGBREIT.KL",
      price: 1.65,
      change: 0.1,
      status: "halal" as const,
      description: "Shariah-compliant real estate investment trust",
      category: "realestate"
    },
    {
      name: "Capitaland Investment",
      symbol: "CLI.SI",
      price: 3.42,
      change: 0.2,
      status: "halal" as const,
      description: "Real estate investment and management",
      category: "realestate"
    },
    
    // Infrastructure Stocks (5)
    {
      name: "Malaysia Airports",
      symbol: "MAHB.KL",
      price: 6.84,
      change: 0.3,
      status: "halal" as const,
      description: "Airport management and operations",
      category: "infrastructure"
    },
    {
      name: "Saudi Electricity",
      symbol: "SECO.SR",
      price: 25.35,
      change: 0.6,
      status: "halal" as const,
      description: "Electricity generation and distribution",
      category: "infrastructure"
    },
    {
      name: "Tenaga Nasional",
      symbol: "TENAGA.KL",
      price: 9.75,
      change: 0.4,
      status: "halal" as const,
      description: "Electricity generation and distribution",
      category: "infrastructure"
    },
    {
      name: "TAQA",
      symbol: "TAQA.AD",
      price: 1.52,
      change: -0.1,
      status: "halal" as const,
      description: "Energy and water utilities",
      category: "infrastructure"
    },
    {
      name: "Indus Towers",
      symbol: "INDUSTOWER.NS",
      price: 182.45,
      change: 1.2,
      status: "halal" as const,
      description: "Telecom infrastructure provider",
      category: "infrastructure"
    },
    
    // Agriculture Stocks (5)
    {
      name: "Sime Darby Plantation",
      symbol: "SDPL.KL",
      price: 4.27,
      change: -0.4,
      status: "halal" as const,
      description: "Palm oil production and distribution",
      category: "agriculture"
    },
    {
      name: "FGV Holdings",
      symbol: "FGV.KL",
      price: 1.38,
      change: 0.2,
      status: "halal" as const,
      description: "Palm oil and rubber plantations",
      category: "agriculture"
    },
    {
      name: "IOI Corporation",
      symbol: "IOICORP.KL",
      price: 3.95,
      change: 0.3,
      status: "halal" as const,
      description: "Palm oil plantations and oleochemicals",
      category: "agriculture"
    },
    {
      name: "Kuala Lumpur Kepong",
      symbol: "KLK.KL",
      price: 21.86,
      change: -0.2,
      status: "halal" as const,
      description: "Palm oil and rubber plantations",
      category: "agriculture"
    },
    {
      name: "Bunge Limited",
      symbol: "BG",
      price: 92.35,
      change: 0.8,
      status: "halal" as const,
      description: "Agribusiness and food production",
      category: "agriculture"
    }
  ];

  const filterStocks = () => {
    let filtered = halalStocks;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(stock => stock.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(stock => 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate search loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const categories = [
    { id: 'all', name: 'All Stocks' },
    { id: 'technology', name: 'Technology' },
    { id: 'finance', name: 'Finance' },
    { id: 'consumer', name: 'Consumer' },
    { id: 'realestate', name: 'Real Estate' },
    { id: 'infrastructure', name: 'Infrastructure' },
    { id: 'agriculture', name: 'Agriculture' }
  ];

  const filteredStocks = filterStocks();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                Halal Stock Investments
              </h1>
              <p className="text-white/70 mb-8">
                Invest in pre-vetted Shariah-compliant companies from around the world. All stocks listed here have passed our rigorous Islamic screening process.
              </p>
              <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
                <Input
                  placeholder="Search for stocks by name or symbol..."
                  className="pr-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender h-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-12 w-12"
                >
                  <Search className="h-5 w-5 text-lavender" />
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="overflow-x-auto">
              <div className="flex space-x-2 min-w-max pb-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className={activeCategory === category.id 
                      ? "bg-lavender hover:bg-lavender-dark text-white" 
                      : "text-white/70 border-white/10 hover:bg-lavender/10 hover:text-lavender"
                    }
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stocks Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="py-20">
                <LoadingAnimation type="spinner" size="lg" text="Loading stocks..." />
              </div>
            ) : filteredStocks.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {activeCategory === 'all' ? 'All Halal Stocks' : `${categories.find(c => c.id === activeCategory)?.name}`}
                  </h2>
                  <span className="text-white/60 text-sm">{filteredStocks.length} stocks found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStocks.map((stock, index) => (
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
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">No stocks found</h2>
                <p className="text-white/60 mb-6">Try a different search term or category</p>
                <Button 
                  variant="outline" 
                  className="border-lavender text-lavender hover:bg-lavender/20"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-lavender/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-gradient">Ready to Start Investing?</h2>
              <p className="text-white/70 mb-8">
                Create an account to start building your halal investment portfolio today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-lavender hover:bg-lavender-dark text-white"
                >
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  className="border-lavender text-lavender hover:bg-lavender/20"
                >
                  Learn About Islamic Finance
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Stocks;
