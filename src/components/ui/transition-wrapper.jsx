import React, { ReactNode } from 'react';
import '@/styles/transitions.css';



/**
 * A simplified wrapper component that adds CSS classes for animations
 * without causing black screens or navigation issues
 */
const TransitionWrapper = ({
  children,
  transitionType = 'fade',
  duration = 300,
}) => {
  // Set the CSS variable for transition duration
  React.useEffect(() => {
    document.documentElement.style.setProperty('--transition-duration', `${duration}ms`);
  }, [duration]);

  return (
    <div className="page-container fade-in">
      {children}
    </div>
  );
};

export default TransitionWrapper;
