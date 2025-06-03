import React, { ReactNode } from 'react';
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  linkTo: string;
  variant?: 'primary' | 'secondary';
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  description,
  icon,
  linkTo,
  variant = 'secondary'
}) => {
  return (
    <div className={`p-6 rounded-xl shadow-sm ${
      variant === 'primary' 
        ? 'bg-lavender text-white' 
        : 'bg-white text-black'
    }`}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-full ${
          variant === 'primary' 
            ? 'bg-white/20' 
            : 'bg-lavender/20'
        }`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className={`mb-4 ${variant === 'primary' ? 'text-white/90' : 'text-black/80'}`}>
        {description}
      </p>
      <Link 
        to={linkTo} 
        className={`inline-flex items-center text-sm font-medium ${
          variant === 'primary' 
            ? 'text-white hover:text-white/80' 
            : 'text-lavender hover:text-lavender-dark'
        }`}
      >
        Learn more <ArrowRight className="ml-1 h-4 w-4" />
      </Link>
    </div>
  );
};

export default FeaturedCard;
