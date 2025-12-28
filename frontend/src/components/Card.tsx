import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-md transition-all duration-200 ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
