
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Share } from 'lucide-react';
import HalalBadge from './HalalBadge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';



const StockCard = ({
  name,
  symbol,
  price,
  change,
  status,
  description,
  className,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewDetails = () => {
    // Navigate to stock details instead of wallet
    navigate(`/stocks/${symbol}`);
  };

  const handleInvest = (e) => {
    e.stopPropagation();
    toast({
      title: "Investment Options",
      description: `Choose investment options for ${name} (${symbol})`,
    });
    
    // Navigate to stock details with investment tab active
    navigate(`/stocks/${symbol}?tab=invest`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    toast({
      title: "Share Link Generated",
      description: `Share link for ${symbol} h copied to clipboard`,
    });
  };
  
  const handleCardClick = () => {
    navigate(`/stocks/${symbol}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        'rounded-xl p-5 transition-all duration-300 hover:shadow-xl border cursor-pointer',
        'bg-gradient-to-br from-secondary/40 to-secondary/10 border-white/10',
        'hover:border-lavender/30',
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{name}</h3>
            <HalalBadge type={status} size="sm" />
          </div>
          <p className="text-xs text-black mt-1">{symbol}</p>
        </div>
        <Button 
          size="icon" 
          variant="ghost"
          onClick={handleShare} 
          className="h-8 w-8 rounded-full hover:bg-lavender/20"
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
      
      {description && (
        <p className="text-sm text-black mb-4 line-clamp-2">{description}</p>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">${price ? price.toFixed(2) : '0.00'}</div>
        <div 
          className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            (change || 0) > 0 ? "text-green-400" : "text-red-400"
          )}
        >
          {(change || 0) > 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span>{change ? Math.abs(change).toFixed(2) : '0.00'}%</span>
        </div>
      </div>
      
      <Button 
        onClick={handleInvest}
        className="w-full bg-lavender hover:bg-lavender-dark"
        disabled={status === 'haram'}
      >
        {status === 'haram' ? 'Non-Halal' : 'Invest Now'}
      </Button>
    </div>
  );
};

export default StockCard;
