import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, AlertTriangle, Zap } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface OrderFormProps {
  stockName: string;
  stockSymbol: string;
  currentPrice: number;
  onOrderPlaced: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  stockName,
  stockSymbol,
  currentPrice,
  onOrderPlaced
}) => {
  const { toast } = useToast();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('1');
  const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
  const [orderMode, setOrderMode] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState(currentPrice.toFixed(2));
  const [useStopLoss, setUseStopLoss] = useState(true);
  const [stopLossPrice, setStopLossPrice] = useState((currentPrice * 0.95).toFixed(2));
  const [useAI, setUseAI] = useState(true);
  const [aiRiskLevel, setAiRiskLevel] = useState(50);
  const [estimatedTotal, setEstimatedTotal] = useState(currentPrice);
  const [aiPrediction, setAiPrediction] = useState<{
    recommendation: 'strong buy' | 'buy' | 'hold' | 'sell' | 'strong sell';
    confidence: number;
    stopLossRecommendation: number;
  }>({
    recommendation: 'buy',
    confidence: 75,
    stopLossRecommendation: currentPrice * 0.95
  });

  // Calculate estimated total whenever quantity or price changes
  useEffect(() => {
    const qty = parseInt(quantity) || 0;
    const price = orderMode === 'market' ? currentPrice : parseFloat(limitPrice);
    const total = qty * price;
    setEstimatedTotal(total);
  }, [quantity, limitPrice, orderMode, currentPrice]);

  // Simulate AI prediction
  useEffect(() => {
    // In a real app, this would be an API call to an AI service
    const simulateAiPrediction = () => {
      const recommendations = ['strong buy', 'buy', 'hold', 'sell', 'strong sell'] as const;
      const randomIndex = Math.floor(Math.random() * 5);
      const recommendation = recommendations[randomIndex];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-99%
      
      // AI recommended stop loss (5-15% below current price for buy orders)
      const stopLossPercent = Math.random() * 0.1 + 0.05;
      const recommendedStopLoss = orderType === 'buy' 
        ? currentPrice * (1 - stopLossPercent)
        : currentPrice * (1 + stopLossPercent);
      
      setAiPrediction({
        recommendation,
        confidence,
        stopLossRecommendation: recommendedStopLoss
      });
      
      if (useAI && useStopLoss) {
        setStopLossPrice(recommendedStopLoss.toFixed(2));
      }
    };
    
    // Simulate delay for AI processing
    const timer = setTimeout(simulateAiPrediction, 1000);
    return () => clearTimeout(timer);
  }, [orderType, currentPrice, useAI, useStopLoss, setStopLossPrice]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleLimitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setLimitPrice(value);
    }
  };

  const handleStopLossChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setStopLossPrice(value);
    }
  };

  const handleAiRiskLevelChange = (value: number[]) => {
    if (value && value.length > 0) {
      setAiRiskLevel(value[0]);
      
      // Adjust stop loss based on risk level if AI is enabled
      if (useAI && useStopLoss) {
        // Higher risk level = wider stop loss
        const riskFactor = 1 - (value[0] / 100) * 0.15; // 0.85 to 1.0
        const newStopLoss = orderType === 'buy'
          ? currentPrice * riskFactor
          : currentPrice * (2 - riskFactor);
        
        setStopLossPrice(newStopLoss.toFixed(2));
      }
    }
  };

  const handlePlaceOrder = () => {
    const qty = parseInt(quantity);
    
    if (isNaN(qty) || qty <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid number of shares",
        variant: "destructive"
      });
      return;
    }
    
    if (orderMode === 'limit' && (isNaN(parseFloat(limitPrice)) || parseFloat(limitPrice) <= 0)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid limit price",
        variant: "destructive"
      });
      return;
    }
    
    if (useStopLoss && (isNaN(parseFloat(stopLossPrice)) || parseFloat(stopLossPrice) <= 0)) {
      toast({
        title: "Invalid Stop Loss",
        description: "Please enter a valid stop loss price",
        variant: "destructive"
      });
      return;
    }
    
    // Validate stop loss direction based on order type
    if (useStopLoss) {
      const stopLossValue = parseFloat(stopLossPrice);
      if (orderType === 'buy' && stopLossValue >= currentPrice) {
        toast({
          title: "Invalid Stop Loss",
          description: "For buy orders, stop loss must be below the current price",
          variant: "destructive"
        });
        return;
      } else if (orderType === 'sell' && stopLossValue <= currentPrice) {
        toast({
          title: "Invalid Stop Loss",
          description: "For sell orders, stop loss must be above the current price",
          variant: "destructive"
        });
        return;
      }
    }
    
    toast({
      title: "Order Placed Successfully",
      description: `${orderType.toUpperCase()} ${quantity} shares of ${stockSymbol} at ${orderMode === 'market' ? 'market price' : '$' + limitPrice}`,
    });
    
    onOrderPlaced();
  };

  const getRecommendationColor = () => {
    switch (aiPrediction.recommendation) {
      case 'strong buy':
      case 'buy':
        return 'text-green-500';
      case 'hold':
        return 'text-yellow-500';
      case 'sell':
      case 'strong sell':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="order-form space-y-6">
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger 
            value="buy" 
            onClick={() => setOrderType('buy')}
            className={orderType === 'buy' ? 'bg-green-500/20 text-green-400' : ''}
          >
            <ArrowUp className="mr-2 h-4 w-4" /> Buy
          </TabsTrigger>
          <TabsTrigger 
            value="sell" 
            onClick={() => setOrderType('sell')}
            className={orderType === 'sell' ? 'bg-red-500/20 text-red-400' : ''}
          >
            <ArrowDown className="mr-2 h-4 w-4" /> Sell
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-secondary/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select value={exchange} onValueChange={(value: 'NSE' | 'BSE') => setExchange(value)}>
                <SelectTrigger className="bg-secondary/50 border-white/10">
                  <SelectValue placeholder="Select Exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NSE">NSE</SelectItem>
                  <SelectItem value="BSE">BSE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Order Type</Label>
            <RadioGroup defaultValue="market" className="flex space-x-4" onValueChange={(value: 'market' | 'limit') => setOrderMode(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="market" id="market" />
                <Label htmlFor="market">Market</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limit" id="limit" />
                <Label htmlFor="limit">Limit</Label>
              </div>
            </RadioGroup>
          </div>
          
          {orderMode === 'limit' && (
            <div className="space-y-2">
              <Label htmlFor="limitPrice">Limit Price ($)</Label>
              <Input
                id="limitPrice"
                type="text"
                value={limitPrice}
                onChange={handleLimitPriceChange}
                className="bg-secondary/50 border-white/10"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch id="stopLoss" checked={useStopLoss} onCheckedChange={setUseStopLoss} />
            <Label htmlFor="stopLoss">Use Stop Loss</Label>
          </div>
          
          {useStopLoss && (
            <div className="space-y-2">
              <Label htmlFor="stopLossPrice">Stop Loss Price ($)</Label>
              <Input
                id="stopLossPrice"
                type="text"
                value={stopLossPrice}
                onChange={handleStopLossChange}
                className="bg-secondary/50 border-white/10"
              />
              <p className="text-xs text-white/60">
                {orderType === 'buy' 
                  ? 'Your order will be sold if the price falls to this level' 
                  : 'Your short position will be closed if the price rises to this level'}
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch id="aiAssist" checked={useAI} onCheckedChange={setUseAI} />
            <Label htmlFor="aiAssist" className="flex items-center">
              <Zap className="h-4 w-4 mr-1 text-lavender" />
              AI-Powered Risk Management
            </Label>
          </div>
          
          {useAI && (
            <div className="space-y-4 p-4 bg-lavender/5 rounded-lg border border-lavender/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">AI Recommendation:</span>
                <span className={`text-sm font-bold ${getRecommendationColor()}`}>
                  {aiPrediction.recommendation.toUpperCase()} ({aiPrediction.confidence}% confidence)
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="riskLevel">Risk Tolerance</Label>
                  <span className="text-xs">{aiRiskLevel}%</span>
                </div>
                <Slider
                  id="riskLevel"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={[aiRiskLevel]}
                  onValueChange={handleAiRiskLevelChange}
                  className="my-2"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
              
              {useStopLoss && (
                <div className="flex items-start space-x-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p className="text-white/70">
                    AI has recommended a stop loss at ${aiPrediction.stopLossRecommendation.toFixed(2)} based on 
                    market volatility and your risk tolerance.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex justify-between">
              <span className="text-white/70">Current Price</span>
              <span className="font-semibold">${currentPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Estimated Total</span>
              <span className="font-semibold">${estimatedTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Trading Fee</span>
              <span className="font-semibold">${(estimatedTotal * 0.0025).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-bold">
                ${(estimatedTotal * 1.0025).toFixed(2)}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handlePlaceOrder} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Buy {stockSymbol}
          </Button>
        </TabsContent>
        
        <TabsContent value="sell" className="space-y-4">
          {/* Sell tab has the same fields but with sell-specific logic */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity-sell">Quantity</Label>
              <Input
                id="quantity-sell"
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="bg-secondary/50 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exchange-sell">Exchange</Label>
              <Select value={exchange} onValueChange={(value: 'NSE' | 'BSE') => setExchange(value)}>
                <SelectTrigger className="bg-secondary/50 border-white/10">
                  <SelectValue placeholder="Select Exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NSE">NSE</SelectItem>
                  <SelectItem value="BSE">BSE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Order Type</Label>
            <RadioGroup defaultValue="market" className="flex space-x-4" onValueChange={(value: 'market' | 'limit') => setOrderMode(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="market" id="market-sell" />
                <Label htmlFor="market-sell">Market</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limit" id="limit-sell" />
                <Label htmlFor="limit-sell">Limit</Label>
              </div>
            </RadioGroup>
          </div>
          
          {orderMode === 'limit' && (
            <div className="space-y-2">
              <Label htmlFor="limitPrice-sell">Limit Price ($)</Label>
              <Input
                id="limitPrice-sell"
                type="text"
                value={limitPrice}
                onChange={handleLimitPriceChange}
                className="bg-secondary/50 border-white/10"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch id="stopLoss-sell" checked={useStopLoss} onCheckedChange={setUseStopLoss} />
            <Label htmlFor="stopLoss-sell">Use Stop Loss</Label>
          </div>
          
          {useStopLoss && (
            <div className="space-y-2">
              <Label htmlFor="stopLossPrice-sell">Stop Loss Price ($)</Label>
              <Input
                id="stopLossPrice-sell"
                type="text"
                value={stopLossPrice}
                onChange={handleStopLossChange}
                className="bg-secondary/50 border-white/10"
              />
              <p className="text-xs text-white/60">
                Your sell order will be canceled if the price rises above this level
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch id="aiAssist-sell" checked={useAI} onCheckedChange={setUseAI} />
            <Label htmlFor="aiAssist-sell" className="flex items-center">
              <Zap className="h-4 w-4 mr-1 text-lavender" />
              AI-Powered Risk Management
            </Label>
          </div>
          
          {useAI && (
            <div className="space-y-4 p-4 bg-lavender/5 rounded-lg border border-lavender/20">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">AI Recommendation:</span>
                <span className={`text-sm font-bold ${getRecommendationColor()}`}>
                  {aiPrediction.recommendation.toUpperCase()} ({aiPrediction.confidence}% confidence)
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="riskLevel-sell">Risk Tolerance</Label>
                  <span className="text-xs">{aiRiskLevel}%</span>
                </div>
                <Slider
                  id="riskLevel-sell"
                  defaultValue={[50]}
                  max={100}
                  step={1}
                  value={[aiRiskLevel]}
                  onValueChange={handleAiRiskLevelChange}
                  className="my-2"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
              
              {useStopLoss && (
                <div className="flex items-start space-x-2 text-xs">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <p className="text-white/70">
                    AI has recommended a stop loss at ${aiPrediction.stopLossRecommendation.toFixed(2)} based on 
                    market volatility and your risk tolerance.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2 pt-4 border-t border-white/10">
            <div className="flex justify-between">
              <span className="text-white/70">Current Price</span>
              <span className="font-semibold">${currentPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Estimated Total</span>
              <span className="font-semibold">${estimatedTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-white/70">Trading Fee</span>
              <span className="font-semibold">${(estimatedTotal * 0.0025).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
              <span className="font-medium">Total</span>
              <span className="font-bold">
                ${(estimatedTotal * 0.9975).toFixed(2)}
              </span>
            </div>
          </div>
          
          <Button 
            onClick={handlePlaceOrder} 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Sell {stockSymbol}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderForm;
