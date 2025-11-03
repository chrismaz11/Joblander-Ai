import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto', 
    lg: 'h-16 w-auto'
  };

  return (
    <img
      src="/logo.png"
      alt="JobLander"
      className={`${sizeClasses[size]} ${className} dark:brightness-0 dark:invert`}
    />
  );
}