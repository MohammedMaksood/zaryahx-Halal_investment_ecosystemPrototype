import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Info, X, Plus, Minus, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GroceryCard from "@/components/GroceryCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

const Groceries = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<{id: number, name: string, price: number, quantity: number, image?: string, category: string}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof groceryItems[0] | null>(null);
  const { toast } = useToast();
  
  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('zaryah_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zaryah_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Helper function to ensure all items have images
  const getDefaultImage = (category: string, name: string) => {
    const categoryImages = {
      meat: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGFsYWwlMjBtZWF0fGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80",
      grains: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFzbWF0aSUyMHJpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80",
      fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnJ1aXRzfGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80",
      oils: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2xpdmUlMjBvaWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80",
      spices: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpY2VzfGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80",
      condiments: "https://images.unsplash.com/photo-1558642891-54be180ea339?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZXl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80",
      prepared: "https://images.unsplash.com/photo-1588853331868-00814fa6b545?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtbXVzfGVufDB8fDB8fHww&auto=format&fit=crop&w=200&q=80"
    };
    
    // Return category default or a generic food image
    return categoryImages[category as keyof typeof categoryImages] || 
      `https://source.unsplash.com/200x200/?${encodeURIComponent(name.toLowerCase())},food`;
  };

  // Mock data with added IDs
  const groceryItems = [
    {
      id: 1,
      name: "Premium Halal Beef",
      category: "meat",
      price: 15.99,
      rating: 4.8,
      featured: true,
      image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 2,
      name: "Organic Basmati Rice",
      category: "grains",
      price: 9.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e8c7?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 3,
      name: "Halal Chicken Breast",
      category: "meat",
      price: 12.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 4,
      name: "Dates Medjool",
      category: "fruits",
      price: 8.99,
      rating: 4.9,
      featured: true,
      image: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 5,
      name: "Halal Lamb Chops",
      category: "meat",
      price: 19.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1608500218890-c4f9a2fbcaa1?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 6,
      name: "Olive Oil Extra Virgin",
      category: "oils",
      price: 12.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 7,
      name: "Hummus",
      category: "prepared",
      price: 4.99,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 8,
      name: "Halal Turkey",
      category: "meat",
      price: 13.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 9,
      name: "Tahini Sauce",
      category: "prepared",
      price: 6.49,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1559304192-f8d7c782f617?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 10,
      name: "Halal Breakfast Sausage",
      category: "meat",
      price: 7.99,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 11,
      name: "Organic Honey",
      category: "condiments",
      price: 9.49,
      rating: 4.9,
      featured: true,
      image: "https://images.unsplash.com/photo-1558642891-54be180ea339?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 12,
      name: "Zaatar Spice Mix",
      category: "spices",
      price: 5.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: 13,
      name: "Organic Spinach",
      category: "fruits",
      price: 3.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BpbmFjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 14,
      name: "Fresh Tomatoes",
      category: "fruits",
      price: 2.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1561136594-7f68413baa99?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG9tYXRvZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 15,
      name: "Organic Cucumbers",
      category: "fruits",
      price: 2.49,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VjdW1iZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 16,
      name: "Red Onions",
      category: "fruits",
      price: 1.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1508747703725-719777637510?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVkJTIwb25pb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 17,
      name: "Organic Carrots",
      category: "fruits",
      price: 2.29,
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2Fycm90c3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 18,
      name: "Fresh Pomegranate",
      category: "fruits",
      price: 4.99,
      rating: 4.8,
      featured: true,
      image: "https://images.unsplash.com/photo-1541344999736-83eca272f6fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9tZWdyYW5hdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 19,
      name: "Organic Figs",
      category: "fruits",
      price: 6.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1597875566588-5217d5931b0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zmlnc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 20,
      name: "Fresh Eggplant",
      category: "fruits",
      price: 2.79,
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1613884823171-49bca3bd289f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWdncGxhbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 21,
      name: "Bell Peppers Mix",
      category: "fruits",
      price: 4.49,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmVsbCUyMHBlcHBlcnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 22,
      name: "Organic Zucchini",
      category: "fruits",
      price: 2.99,
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1583687355032-89b902b7335f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8enVjY2hpbml8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=200&q=80"
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

  const addToCart = (item: typeof groceryItems[0]) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      // Item doesn't exist, add new item
      setCartItems([...cartItems, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1,
        image: item.image || getDefaultImage(item.category, item.name),
        category: item.category
      }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  const viewCart = () => {
    setIsCartOpen(true);
  };
  
  const updateCartItemQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      // Update quantity
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };
  
  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item removed from your cart",
    });
  };
  
  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  const showItemDetails = (item: typeof groceryItems[0]) => {
    setSelectedItem(item);
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
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                  <Badge className="ml-2 bg-lavender text-white">{totalCartItems}</Badge>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
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
                  <Badge className="ml-2 bg-lavender text-white">{totalCartItems}</Badge>
                </Button>
              </div>
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
                  {filteredGroceries.map((item) => (
                    <div key={item.id} className="glassy-card rounded-xl overflow-hidden">
                      <div className="h-48 w-full overflow-hidden relative">
                        <img 
                          src={item.image || getDefaultImage(item.category, item.name)} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-110"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            target.src = getDefaultImage(item.category, item.name);
                          }}
                        />
                        {item.featured && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-lavender">Featured</Badge>
                          </div>
                        )}
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md hover:bg-white/30"
                          onClick={() => showItemDetails(item)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                            <p className="text-white/60 text-sm">{categories.find(cat => cat.id === item.category)?.name}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-lg">${item.price.toFixed(2)}</div>
                            <div className="flex items-center text-white/60 text-sm">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            className="flex-1 bg-lavender hover:bg-lavender-dark"
                            onClick={() => addToCart(item)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-lavender text-lavender hover:bg-lavender/20"
                            onClick={() => showItemDetails(item)}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
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
      
      {/* Cart Sidebar */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md bg-background border-l border-white/10">
          <SheetHeader className="mb-5">
            <SheetTitle className="text-2xl flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
              <Badge className="ml-2 bg-lavender text-white">{totalCartItems}</Badge>
            </SheetTitle>
            <SheetDescription>
              Review your items before checkout
            </SheetDescription>
          </SheetHeader>
          
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh]">
              <ShoppingCart className="h-16 w-16 text-white/20 mb-4" />
              <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
              <p className="text-white/60 mb-6 text-center">Browse our halal products and add items to your cart</p>
              <SheetClose asChild>
                <Button className="bg-lavender hover:bg-lavender-dark">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <Button 
                  variant="ghost" 
                  className="text-white/60 hover:text-white hover:bg-white/10"
                  onClick={clearCart}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
                <span className="text-white/60">
                  {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex border border-white/10 rounded-lg overflow-hidden bg-white/5">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img 
                        src={item.image || getDefaultImage(item.category, item.name)} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-white/60">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-7 w-7 rounded-full p-0 border-white/20"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-7 w-7 rounded-full p-0 border-white/20"
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7 rounded-full p-0 text-white/60 hover:text-white hover:bg-white/10"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 mt-6 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2">
                    <span>Total</span>
                    <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-lavender hover:bg-lavender-dark">
                  Proceed to Checkout
                </Button>
                
                <SheetClose asChild>
                  <Button variant="ghost" className="w-full mt-2">
                    Continue Shopping
                  </Button>
                </SheetClose>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Product Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[500px] bg-background border border-white/10">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  {categories.find(cat => cat.id === selectedItem.category)?.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                <div className="rounded-lg overflow-hidden mb-4">
                  <img 
                    src={selectedItem.image || getDefaultImage(selectedItem.category, selectedItem.name)} 
                    alt={selectedItem.name} 
                    className="w-full h-64 object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">Price</div>
                    <div className="font-semibold text-lg">${selectedItem.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="bg-white/5 p-3 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">Rating</div>
                    <div className="font-semibold text-lg flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      {selectedItem.rating}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2">Product Description</h4>
                  <p className="text-white/80">
                    {selectedItem.name} is a premium quality halal product, sourced from trusted suppliers. 
                    This product is certified halal and meets our strict quality standards.
                  </p>
                  
                  <h4 className="font-medium mt-4 mb-2">Nutritional Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Calories</span>
                      <span>120 kcal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Protein</span>
                      <span>5g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Carbs</span>
                      <span>22g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Fat</span>
                      <span>2g</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  className="flex-1 bg-lavender hover:bg-lavender-dark"
                  onClick={() => {
                    addToCart(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groceries;
