
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Eye, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingAnimation from "@/components/LoadingAnimation";



const Orders = () => {
  /**
   * @type {[Array<Object>, function(Array<Object>): void]}
   */
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Simulate loading orders
    setTimeout(() => {
      const mockOrders= [
        {
          id: 'ORD-1234',
          type: 'buy',
          symbol: 'RJHI.SR',
          name: 'Al Rajhi Bank',
          shares: 10,
          price: 89.45,
          total: 894.5,
          date: '2025-05-01',
          status: 'completed'
        },
        {
          id: 'ORD-1235',
          type: 'buy',
          symbol: 'MSFT',
          name: 'Microsoft Corp.',
          shares: 10,
          price: 337.25,
          total: 674.5,
          date: '2025-05-03',
          status: 'completed'
        },
        {
          id: 'ORD-1236',
          type: 'sell',
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          shares: 10,
          price: 176.80,
          total: 176.80,
          date: '2025-04-28',
          status: 'completed'
        },
        {
          id: 'ORD-1237',
          type: 'buy',
          symbol: 'AAPL',
          name: 'Apple Inc.',
          shares: 10,
          price: 172.50,
          total: 862.50,
          date: '2025-05-06',
          status: 'pending'
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      filterStatus === 'all' || 
      order.status === filterStatus;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">My Orders</h1>
            <p className="text-white/60">Track and manage your investment orders</p>
          </div>
          
          <Link to="/wallet">
            <Button 
              variant="outline" 
              className="border-lavender text-lavender hover:bg-lavender/20"
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> View Wallet
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="py-20">
            <LoadingAnimation type="spinner" size="lg" text="Loading your orders..." />
          </div>
        ) : (
          <>
            {/* Filters Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search by symbol, name or order ID..."
                  className="bg-secondary/50 border-white/10 focus-visible:ring-lavender"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  className={filterStatus === 'all' 
                    ? 'bg-lavender hover:bg-lavender-dark' 
                    : 'border-white/10 hover:bg-lavender/10'}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'completed' ? 'default' : 'outline'}
                  className={filterStatus === 'completed' 
                    ? 'bg-lavender hover:bg-lavender-dark' 
                    : 'border-white/10 hover:bg-lavender/10'}
                  onClick={() => setFilterStatus('completed')}
                >
                  Completed
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  className={filterStatus === 'pending' 
                    ? 'bg-lavender hover:bg-lavender-dark' 
                    : 'border-white/10 hover:bg-lavender/10'}
                  onClick={() => setFilterStatus('pending')}
                >
                  Pending
                </Button>
              </div>
            </div>
            
            {/* Orders Table */}
            {filteredOrders.length > 0 ? (
              <div className="bg-secondary/20 border border-white/10 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-secondary/40">
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead className="hidden md:table-cell">Name</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {order.type.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{order.symbol}</TableCell>
                        <TableCell className="hidden md:table-cell">{order.name}</TableCell>
                        <TableCell className="text-right">{order.shares}</TableCell>
                        <TableCell className="text-right">${order.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                            order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link to={`/stocks/${order.symbol}`}>
                            <Button variant="ghost" size="icon" className="hover:bg-lavender/20">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary/20 border border-white/10 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-white/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-white/60 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? "Try adjusting your filters" 
                    : "You haven't placed any orders yet"}
                </p>
                
                <Link to="/stocks">
                  <Button className="bg-lavender hover:bg-lavender-dark">
                    Explore Halal Stocks
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
