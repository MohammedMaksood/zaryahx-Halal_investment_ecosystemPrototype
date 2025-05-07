
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'default';
  className?: string;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  description,
  icon,
  linkTo,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-br from-lavender/20 to-lavender/5 border-lavender/30',
    secondary: 'bg-gradient-to-br from-secondary/40 to-secondary/20 border-white/10',
    accent: 'bg-gradient-to-br from-lavender-dark/30 to-lavender-dark/10 border-lavender/20',
    default: 'glassy-card',
  };

  return (
    <div 
      className={cn(
        'rounded-xl p-6 transition-all duration-300 hover:shadow-xl border',
        'hover:translate-y-[-5px]',
        variantClasses[variant],
        className
      )}
    >
      <div className="h-12 w-12 rounded-lg bg-lavender/20 flex items-center justify-center mb-4">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/70 mb-6">{description}</p>
      
      <Link to={linkTo}>
        <Button 
          variant="ghost" 
          className="group flex items-center justify-between w-full border border-white/10 hover:border-lavender/50 hover:bg-lavender/10"
        >
          <span>Explore</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );
};

export default FeaturedCard;
