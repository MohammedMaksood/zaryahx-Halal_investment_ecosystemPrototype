import React from 'react';



const LoadingSpinner = ({ 
  size = 'md', 
  color = 'lavender',
  className = '',
  text
}) => {
  // Size mapping
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  // Color mapping
  const colorMap = {
    primary: 'border-primary',
    white: 'border-white',
    lavender: 'border-lavender'
  };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center">
        <div
          className={`
            spinner 
            ${sizeMap[size]} 
            border-2 
            ${colorMap[color]} 
            border-t-transparent 
            rounded-full
          `}
          role="status"
          aria-label="loading"
        />
        {text && (
          <span className="mt-2 text-sm text-white/70">{text}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
