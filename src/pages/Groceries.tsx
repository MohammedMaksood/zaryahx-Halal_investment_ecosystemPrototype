
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GroceryCard from "@/components/GroceryCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Groceries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock data
  const groceryItems = [
    {
      name: "Premium Halal Beef",
      category: "meat",
      price: 15.99,
      rating: 4.8,
      featured: true
    },
    {
      name: "Organic Basmati Rice",
      category: "grains",
      price: 9.99,
      rating: 4.7,
      featured: true
    },
    {
      name: "Halal Chicken Breast",
      category: "meat",
      price: 8.99,
      rating: 4.5
    },
    {
      name: "Organic Dates",
      category: "fruits",
      price: 7.49,
      rating: 4.9,
      featured: true
    },
    {
      name: "Halal Lamb Chops",
      category: "meat",
      price: 19.99,
      rating: 4.6
    },
    {
      name: "Olive Oil Extra Virgin",
      category: "oils",
      price: 12.99,
      rating: 4.8
    },
    {
      name: "Hummus",
      category: "prepared",
      price: 4.99,
      rating: 4.4
    },
    {
      name: "Halal Turkey",
      category: "meat",
      price: 13.99,
      rating: 4.3
    },
    {
      name: "Tahini Sauce",
      category: "prepared",
      price: 6.49,
      rating: 4.7
    },
    {
      name: "Halal Breakfast Sausage",
      category: "meat",
      price: 7.99,
      rating: 4.2
    },
    {
      name: "Organic Honey",
      category: "condiments",
      price: 9.49,
      rating: 4.9,
      featured: true
    },
    {
      name: "Zaatar Spice Mix",
      category: "spices",
      price: 5.99,
      rating: 4.6
    }
  ];

  const filterGroceries = () => {
    let filtered = groceryItems;
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  const viewCart = () => {
    toast({
      title: "Shopping Cart",
      description: "Your cart has 0 items",
    });
  };

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'meat', name: 'Meat & Poultry' },
    { id: 'grains', name: 'Grains & Rice' },
    { id: 'fruits', name: 'Fruits & Vegetables' },
    { id: 'oils', name: 'Oils & Fats' },
    { id: 'spices', name: 'Spices & Herbs' },
    { id: 'condiments', name: 'Condiments' },
    { id: 'prepared', name: 'Prepared Foods' }
  ];

  const filteredGroceries = filterGroceries();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
                  Halal Groceries
                </h1>
                <p className="text-white/70 mb-8">
                  Shop from our curated selection of halal-certified food items and groceries from trusted vendors and brands.
                </p>
                <form onSubmit={handleSearch} className="relative max-w-md">
                  <Input
                    placeholder="Search for halal groceries..."
                    className="pr-10 bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-4 w-4 text-lavender" />
                  </Button>
                </form>
              </div>
              
              <div className="hidden md:block">
                <Button 
                  variant="outline" 
                  className="border-lavender text-lavender hover:bg-lavender/20"
                  onClick={viewCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart
                  <Badge className="ml-2 bg-lavender text-white">0</Badge>
                </Button>
              </div>
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
            
            <div className="mt-4 md:hidden">
              <Button 
                variant="outline" 
                className="w-full border-lavender text-lavender hover:bg-lavender/20"
                onClick={viewCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart
                <Badge className="ml-2 bg-lavender text-white">0</Badge>
              </Button>
            </div>
          </div>
        </section>

        {/* Groceries Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="py-20">
                <LoadingAnimation type="spinner" size="lg" text="Loading groceries..." />
              </div>
            ) : filteredGroceries.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    {activeCategory === 'all' ? 'All Products' : `${categories.find(c => c.id === activeCategory)?.name}`}
                  </h2>
                  <span className="text-white/60 text-sm">{filteredGroceries.length} products</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGroceries.map((item, index) => (
                    <GroceryCard
                      key={index}
                      name={item.name}
                      category={categories.find(cat => cat.id === item.category)?.name || item.category}
                      price={item.price}
                      rating={item.rating}
                      featured={item.featured}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
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

        {/* Halal Certification Info */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gradient">Our Halal Certification</h2>
              <p className="mt-2 text-white/70">
                All products on ZaryahX are strictly verified for halal compliance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glassy-card rounded-xl p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-lavender/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-lavender">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Trusted Certification</h3>
                <p className="text-white/70">
                  All products are certified by recognized Islamic organizations, ensuring strict adherence to halal standards.
                </p>
              </div>
              
              <div className="glassy-card rounded-xl p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-lavender/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-lavender">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Regular Inspection</h3>
                <p className="text-white/70">
                  Our products undergo regular inspections and monitoring to maintain halal integrity throughout production.
                </p>
              </div>
              
              <div className="glassy-card rounded-xl p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-lavender/20 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-lavender">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Transparent Supply Chain</h3>
                <p className="text-white/70">
                  We provide full transparency on our product sources, ingredients, and processing methods.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                className="bg-lavender hover:bg-lavender-dark"
              >
                Learn About Our Halal Standards
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Groceries;
