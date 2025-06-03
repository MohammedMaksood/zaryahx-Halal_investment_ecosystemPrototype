import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// StockHolding interface is now a comment in usePortfolio.js



const StockTransactionDialog = ({
  open,
  onOpenChange,
  stock,
  transactionType,
  onComplete
}) => {
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);

  if (!stock) return null;

  const handleTransaction = () => {
    setProcessing(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setProcessing(false);
      onComplete(true, quantity);
      onOpenChange(false);
    }, 1000);
  };

  const totalCost = quantity * (stock.currentPrice || 0);
  const maxSellQuantity = transactionType === 'sell' ? stock.quantity : Infinity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {transactionType === 'buy' ? 'Buy' : 'Sell'} {stock.name}
          </DialogTitle>
          <DialogDescription>
            Current price: ${stock.currentPrice ? stock.currentPrice.toFixed(2) : '0.00'} per share
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
              min={1}
              max={transactionType === 'sell' ? maxSellQuantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total</Label>
            <div className="col-span-3 font-medium">
              ${totalCost.toFixed(2)}
            </div>
          </div>
          
          {transactionType === 'sell' && (
            <div className="text-sm text-black">
              You currently own {stock.quantity} shares of {stock.symbol}.
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleTransaction}
            disabled={processing || (transactionType === 'sell' && quantity > maxSellQuantity)}
            className="bg-lavender hover:bg-lavender-dark"
          >
            {processing ? 'Processing...' : `Confirm ${transactionType === 'buy' ? 'Purchase' : 'Sale'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StockTransactionDialog;
