import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to handle animation resets when navigating to the same route
 * This solves the issue where animations don't trigger when navigating from navbar
 * @param initialState - Initial state of the animation flag
 * @param delay - Delay in ms before triggering the animation
 * @returns Animation state boolean
 */
export const useResetAnimation = (initialState: boolean = false, delay: number = 300): boolean => {
  const [animationState, setAnimationState] = useState(initialState);
  const location = useLocation();

  useEffect(() => {
    // First reset the animation state to false
    setAnimationState(false);
    
    // Create a unique identifier for this effect instance
    const effectId = Date.now();
    
    // Store the current effect ID in localStorage to track navigation events
    const prevEffectId = localStorage.getItem('animationEffectId');
    localStorage.setItem('animationEffectId', effectId.toString());
    
    // Only trigger animation after delay
    const timer = setTimeout(() => {
      setAnimationState(true);
    }, delay);
    
    // Clean up
    return () => {
      clearTimeout(timer);
    };
  }, [location.key, delay]); // location.key changes on every navigation event

  return animationState;
};
