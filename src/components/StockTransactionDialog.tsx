import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface StockTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: {
    name: string;
    symbol: string;
    currentPrice: number;
  } | null;
  transactionType: 'buy' | 'sell';
  onComplete: (success: boolean) => void;
  maxSellQuantity?: number;
}

const StockTransactionDialog: React.FC<StockTransactionDialogProps> = ({
  open,
  onOpenChange,
  stock,
  transactionType,
  onComplete,
  maxSellQuantity
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      // If selling, limit to max quantity owned
      if (transactionType === 'sell' && maxSellQuantity) {
        setQuantity(Math.min(value, maxSellQuantity));
      } else {
        setQuantity(value);
      }
    } else {
      setQuantity(1); // Default to 1 if invalid input
    }
  };

  const totalAmount = stock ? quantity * stock.currentPrice : 0;

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      
      // Call the completion handler with success
      onComplete(true);
      
      // Show success toast
      toast({
        title: `${transactionType === 'buy' ? 'Purchase' : 'Sale'} Successful`,
        description: `${transactionType === 'buy' ? 'Bought' : 'Sold'} ${quantity} shares of ${stock?.symbol} for $${totalAmount.toFixed(2)}`,
      });
      
      // Close the dialog
      onOpenChange(false);
    }, 1500);
  };

  if (!stock) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-md border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {transactionType === 'buy' ? 'Buy' : 'Sell'} {stock.name}
          </DialogTitle>
          <DialogDescription>
            Current price: ${stock.currentPrice.toFixed(2)} per share
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={transactionType === 'sell' ? maxSellQuantity : undefined}
              className="col-span-3 bg-secondary/30"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total</Label>
            <div className="col-span-3 font-medium">
              ${totalAmount.toFixed(2)}
            </div>
          </div>
          
          {transactionType === 'sell' && maxSellQuantity && (
            <div className="text-sm text-white/60 mt-2">
              You currently own {maxSellQuantity} shares of {stock.symbol}.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing}
            className={transactionType === 'buy' ? 'bg-lavender hover:bg-lavender-dark' : 'bg-red-500 hover:bg-red-600'}
          >
            {isProcessing ? 'Processing...' : transactionType === 'buy' ? 'Buy Shares' : 'Sell Shares'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockTransactionDialog;
