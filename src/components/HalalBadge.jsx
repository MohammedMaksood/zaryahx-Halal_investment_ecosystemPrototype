
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';



const HalalBadge = ({
  type,
  className,
  size = 'md',
  showLabel = true
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const badgeClass = cn(
    'rounded-full flex items-center justify-center gap-1 font-medium border',
    sizeClasses[size],
    {
      'bg-halal/10 border-halal text-halal-light': type === 'halal',
      'bg-haram/10 border-haram text-haram-light': type === 'haram',
      'bg-lavender/10 border-lavender text-lavender-light': type === 'pending',
    },
    className
  );

  const renderIcon = () => {
    switch (type) {
      case 'halal':
        return <Check className={iconSizeClasses[size]} />;
      case 'haram':
        return <X className={iconSizeClasses[size]} />;
      case 'pending':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-full bg-lavender w-1 h-1"
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                }}
              />
            ))}
          </div>
        );
    }
  };

  const renderLabel = () => {
    if (!showLabel) return null;
    
    switch (type) {
      case 'halal':
        return 'Halal';
      case 'haram':
        return 'Haram';
      case 'pending':
        return 'Analyzing';
    }
  };

  return (
    <div className={badgeClass}>
      {renderIcon()}
      {showLabel && <span>{renderLabel()}</span>}
    </div>
  );
};

export default HalalBadge;
