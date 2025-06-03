
import React from 'react';
import { cn } from '@/lib/utils';



const LoadingAnimation = ({
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
            {/* AI Analysis Visualization */}
            <div className="relative w-48 h-48 mb-4">
              {/* Outer scanning circle */}
              <div className="absolute inset-0 rounded-full border-4 border-lavender/20 animate-pulse-slow"></div>
              
              {/* Rotating scanner beam */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-lavender to-transparent animate-rotate-cw"
                  style={{ transformOrigin: 'top' }}
                ></div>
              </div>
              
              {/* Inner circles */}
              <div className="absolute inset-4 rounded-full border-2 border-lavender/30 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-8 rounded-full border border-lavender/40 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-12 rounded-full border border-lavender/50 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-lavender animate-pulse-glow"></div>
              </div>
              
              {/* Data points */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * (Math.PI / 180);
                const radius = 20 + Math.random() * 40;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <div 
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-lavender animate-pulse-fast"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      animationDelay: `${i * 0.2}s`,
                      opacity: Math.random() * 0.5 + 0.5
                    }}
                  ></div>
                );
              })}
              
              {/* Binary code animation */}
              <div className="absolute -top-6 -left-6 text-[8px] text-lavender/60 font-mono animate-fade-in-out overflow-hidden w-12 h-12">
                {[...Array(20)].map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{Math.round(Math.random())}</span>
                ))}
              </div>
              <div className="absolute -bottom-6 -right-6 text-[8px] text-lavender/60 font-mono animate-fade-in-out overflow-hidden w-12 h-12">
                {[...Array(20)].map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{Math.round(Math.random())}</span>
                ))}
              </div>
            </div>
            
            {/* Status text with typing effect */}
            <div className="h-6">
              {text && <span className="text-sm text-white/70 animate-typing overflow-hidden whitespace-nowrap">{text}</span>}
            </div>
            
            {/* Processing indicators */}
            <div className="flex space-x-3 mt-2">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-2 h-2 rounded-full bg-lavender animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
              ))}
            </div>
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
