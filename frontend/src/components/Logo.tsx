/**
 * Logo component - displays the NoOversight brand with custom typography
 */
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showTagline = true 
}) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const taglineSizeClasses = {
    sm: 'text-[10px] mt-0.5',
    md: 'text-xs mt-1',
    lg: 'text-sm mt-1.5'
  };

  return (
    <div className="logo-container">
      <h1 className={`logo-text ${sizeClasses[size]}`}>
        <span className="logo-no">No</span>
        <span className="logo-oversight">Oversight</span>
      </h1>
      {showTagline && (
        <p className={`logo-tagline ${taglineSizeClasses[size]}`}>
          Collaborative AI reasoning
        </p>
      )}
    </div>
  );
};

