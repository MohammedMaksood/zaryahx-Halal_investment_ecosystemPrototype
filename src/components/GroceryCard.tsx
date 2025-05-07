
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface GroceryCardProps {
  name: string;
  category: string;
  price: number;
  rating?: number;
  imageSrc?: string;
  featured?: boolean;
  className?: string;
}

const GroceryCard: React.FC<GroceryCardProps> = ({
  name,
  category,
  price,
  rating,
  imageSrc,
  featured = false,
  className,
}) => {
  const [added, setAdded] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = () => {
    setAdded(true);
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart`,
    });
    
    // Reset after 2 seconds
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div 
      className={cn(
        'rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border',
        featured 
          ? 'bg-gradient-to-br from-lavender/20 to-lavender/5 border-lavender/30' 
          : 'bg-gradient-to-br from-secondary/40 to-secondary/10 border-white/10',
        'hover:translate-y-[-5px]',
        className
      )}
    >
      <div className="relative h-48 w-full">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-lavender/10">
            <span className="text-lavender text-4xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3">
          <Badge 
            className={cn(
              "border",
              featured ? "bg-lavender/20 text-lavender-light border-lavender/50" : "bg-green-500/20 text-green-300 border-green-500/30"
            )}
          >
            Halal Certified
          </Badge>
        </div>
        
        {featured && (
          <div className="absolute top-3 right-3">
            <Badge 
              className="bg-lavender text-white"
            >
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-xs text-white/60">{category}</p>
          </div>
          <div className="text-lg font-semibold text-lavender-light">
            ${price.toFixed(2)}
          </div>
        </div>
        
        {rating && (
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" 
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(rating) ? "text-lavender" : "text-white/20"
                )}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-white/70 ml-2">{rating.toFixed(1)}</span>
          </div>
        )}
        
        <Button
          onClick={handleAddToCart}
          className={cn(
            "w-full transition-all",
            added 
              ? "bg-green-600 hover:bg-green-700"
              : featured 
                ? "bg-lavender hover:bg-lavender-dark"
                : "bg-lavender hover:bg-lavender-dark"
          )}
        >
          {added ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GroceryCard;
