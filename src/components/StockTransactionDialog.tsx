import React, { useState, useEffect } from 'react';
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
import { useWallet } from "@/contexts/WalletContext";
import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StockTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: {
    name: string;
    symbol: string;
    currentPrice: number;
  } | null;
  transactionType: 'buy' | 'sell';
  onComplete: (success: boolean, quantity: number) => void;
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
  // Initialize quantity to maxSellQuantity for sell transactions, 1 for buy
  const [quantity, setQuantity] = useState<number>(
    transactionType === 'sell' && maxSellQuantity ? maxSellQuantity : 1
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [insufficientFunds, setInsufficientFunds] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const { toast } = useToast();
  const { balance, withdrawFunds, addPendingTransaction, completePendingTransaction } = useWallet();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    console.log('Quantity input changed to:', value);
    console.log('Transaction type:', transactionType);
    console.log('Max sell quantity:', maxSellQuantity);
    
    if (!isNaN(value) && value > 0) {
      // If selling, limit to max quantity owned
      if (transactionType === 'sell' && maxSellQuantity) {
        const limitedValue = Math.min(value, maxSellQuantity);
        console.log('Setting limited quantity for sell:', limitedValue);
        setQuantity(limitedValue);
      } else {
        console.log('Setting quantity for buy:', value);
        setQuantity(value);
      }
    } else {
      console.log('Invalid input, defaulting to 1');
      setQuantity(1); // Default to 1 if invalid input
    }
  };

  const totalAmount = stock ? quantity * stock.currentPrice : 0;

  // Check if user has enough funds whenever quantity changes
  useEffect(() => {
    if (transactionType === 'buy' && stock) {
      setInsufficientFunds(totalAmount > balance);
    } else {
      setInsufficientFunds(false);
    }
  }, [quantity, stock, transactionType, balance, totalAmount]);

  // Auto-hide confirmation after 2 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showConfirmation) {
      timer = setTimeout(() => {
        setShowConfirmation(false);
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showConfirmation]);

  const handleSubmit = () => {
    setIsProcessing(true);
    
    // For buy orders, check wallet balance and deduct funds
    if (transactionType === 'buy') {
      if (totalAmount > balance) {
        setIsProcessing(false);
        setInsufficientFunds(true);
        return;
      }
      
      // Withdraw funds and create pending transaction
      const success = withdrawFunds(totalAmount);
      if (!success) {
        setIsProcessing(false);
        setInsufficientFunds(true);
        return;
      }
      
      // Add transaction to pending list
      const txnId = addPendingTransaction({
        type: 'purchase',
        amount: totalAmount,
        details: `Purchased ${quantity} shares of ${stock?.symbol} @ $${stock?.currentPrice.toFixed(2)}`,
        status: 'pending'
      });
      
      // Simulate API call to process the order
      setTimeout(() => {
        setIsProcessing(false);
        completePendingTransaction(txnId);
        
        // Call the completion handler with success and quantity
        onComplete(true, quantity);
        
        // Show success notification in toast
        toast({
          title: `Order Placed Successfully`,
          description: `Bought ${quantity} shares of ${stock?.symbol} for $${totalAmount.toFixed(2)}`,
          variant: "default",
        });
        
        // Show confirmation popup
        setShowConfirmation(true);
        
        // Close the dialog
        onOpenChange(false);
      }, 1500);
    } else {
      // Handle sell orders
      setTimeout(() => {
        setIsProcessing(false);
        
        // Call the completion handler with success and quantity
        onComplete(true, quantity);
        
        // Show success toast
        toast({
          title: `Sale Successful`,
          description: `Sold ${quantity} shares of ${stock?.symbol} for $${totalAmount.toFixed(2)}`,
        });
        
        // Close the dialog
        onOpenChange(false);
      }, 1500);
    }
  };

  if (!stock) return null;

  return (
    <>
      {showConfirmation && (
        <div className="fixed top-4 right-4 z-50 transition-opacity duration-300 ease-in-out">
          <Alert variant="default" className="bg-green-600 text-white border-none">
            <Check className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your order for {quantity} shares of {stock.symbol} has been placed successfully!
            </AlertDescription>
          </Alert>
        </div>
      )}
    
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

          {transactionType === 'buy' && (
            <div className="text-sm mt-2 flex justify-between">
              <span className="text-white/60">Wallet Balance:</span>
              <span className={balance < totalAmount ? "text-red-400" : "text-green-400"}>
                ${balance.toFixed(2)}
              </span>
            </div>
          )}

          {insufficientFunds && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Insufficient funds</AlertTitle>
              <AlertDescription>
                You don't have enough balance to complete this purchase. Please add funds to your wallet.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || (transactionType === 'buy' && insufficientFunds)}
            className={transactionType === 'buy' ? 'bg-lavender hover:bg-lavender-dark' : 'bg-red-500 hover:bg-red-600'}
          >
            {isProcessing ? 'Processing...' : transactionType === 'buy' ? 'Buy Shares' : 'Sell Shares'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default StockTransactionDialog;
