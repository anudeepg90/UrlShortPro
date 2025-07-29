import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

// Custom SVG Logo component matching the favicon design
const LogoSVG: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
    <path d="M8 12H24M8 16H20M8 20H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 20L26 16L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3B82F6' }}/>
        <stop offset="100%" style={{ stopColor: '#6366F1' }}/>
      </linearGradient>
    </defs>
  </svg>
);

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 48
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <LogoSVG size={sizeMap[size]} />
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent ${textSizes[size]}`}>
          TinyYOUrl
        </span>
      )}
    </div>
  );
};

export default Logo; 