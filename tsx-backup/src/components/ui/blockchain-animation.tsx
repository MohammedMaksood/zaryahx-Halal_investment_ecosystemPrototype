import React, { useEffect, useState } from 'react';
import '@/styles/transitions.css';

interface BlockchainAnimationProps {
  type: 'transaction' | 'connection' | 'verification';
  status: 'pending' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

/**
 * A component that displays animated blockchain-related visualizations
 */
const BlockchainAnimation: React.FC<BlockchainAnimationProps> = ({
  type,
  status,
  size = 'md',
  onComplete
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Size mapping
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        onComplete?.();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [status, onComplete]);

  // Render different animations based on type and status
  const renderAnimation = () => {
    if (type === 'transaction') {
      if (status === 'pending') {
        return (
          <div className={`relative ${sizeMap[size]}`}>
            <div className="absolute inset-0 border-4 border-lavender/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-lavender rounded-full spinner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-1/2 h-1/2 text-lavender/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      } else if (status === 'success') {
        return (
          <div className={`relative ${sizeMap[size]} fade-in`}>
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-2/3 h-2/3 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`relative ${sizeMap[size]} fade-in`}>
            <div className="absolute inset-0 border-4 border-red-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-2/3 h-2/3 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      }
    } else if (type === 'connection') {
      if (status === 'pending') {
        return (
          <div className={`relative ${sizeMap[size]}`}>
            <div className="absolute inset-0 border-4 border-lavender/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-lavender rounded-full spinner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-1/2 h-1/2 text-lavender/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12H16M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      } else if (status === 'success') {
        return (
          <div className={`relative ${sizeMap[size]} fade-in`}>
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-2/3 h-2/3 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12L11 15L16 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`relative ${sizeMap[size]} fade-in`}>
            <div className="absolute inset-0 border-4 border-red-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-2/3 h-2/3 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15L15 9M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      }
    } else { // verification
      if (status === 'pending') {
        return (
          <div className={`relative ${sizeMap[size]}`}>
            <div className="absolute inset-0 border-4 border-lavender/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-lavender rounded-full spinner"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-1/2 h-1/2 text-lavender/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      } else if (status === 'success') {
        return (
          <div className={`relative ${sizeMap[size]} fade-in`}>
            <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-2/3 h-2/3 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      } else {
        return (
          <div className={`relative ${sizeMap[size]} fade-in`}>
            <div className="absolute inset-0 border-4 border-red-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-2/3 h-2/3 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 15L15 9M9 9L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      {renderAnimation()}
    </div>
  );
};

export default BlockchainAnimation;
