import React from 'react';

interface RemixIconProps {
  name: string; // e.g. "calendar-line", "restaurant-line"
  className?: string;
  title?: string;
}

export const RemixIcon: React.FC<RemixIconProps> = ({ name, className = '', title }) => {
  // If name already includes "ri-", use it; otherwise prepend "ri-"
  const iconClass = name.startsWith('ri-') ? name : `ri-${name}`;
  return <i className={`${iconClass} inline-flex items-center justify-center leading-none ${className}`} title={title} />;
};
