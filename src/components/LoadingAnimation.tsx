
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  type?: 'dots' | 'spinner' | 'pulse' | 'analysis';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  text?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = 'dots',
  size = 'md',
  color,
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const renderLoading = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className="flex items-center justify-center space-x-2">
            <svg
              className={cn(
                'animate-rotate-cw',
                sizeClasses[size],
                color ? color : 'text-lavender'
              )}
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <path
                className="opacity-80"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                d="M12 2a10 10 0 0 1 10 10"
              />
            </svg>
            {text && <span className="text-sm text-white/70">{text}</span>}
          </div>
        );
      
      case 'pulse':
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div
              className={cn(
                'animate-pulse-glow rounded-full',
                color ? color : 'bg-lavender',
                sizeClasses[size]
              )}
            />
            {text && <span className="text-sm text-white/70">{text}</span>}
          </div>
        );
      
      case 'analysis':
        return (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center justify-center space-x-1 h-10">
              <div className="flex space-x-1">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'bg-lavender rounded-full',
                      dotSizes[size],
                    )}
                    style={{
                      animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
                      opacity: Math.max(0.3, Math.min(0.9, 0.3 + i * 0.05))
                    }}
                  />
                ))}
              </div>
            </div>
            {text && <span className="text-sm text-white/70">{text}</span>}
          </div>
        );
      
      case 'dots':
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-full',
                    color ? color : 'bg-lavender',
                    dotSizes[size]
                  )}
                  style={{
                    animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                  }}
                />
              ))}
            </div>
            {text && <span className="text-sm text-white/70">{text}</span>}
          </div>
        );
    }
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {renderLoading()}
    </div>
  );
};

export default LoadingAnimation;
