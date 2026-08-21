import React from 'react';

export default function Link({
  href = '#',
  children,
  className = '',
  variant = 'default',
  ...props
}) {
  const baseStyle =
    'relative transition-colors inline-block after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-secondary hover:after:w-full after:transition-all after:duration-300';

  const variants = {
    default: `${baseStyle} text-on-surface-variant hover:text-on-surface`,
    secondary: `${baseStyle} text-secondary hover:text-secondary-fixed-dim`,
    primary: `${baseStyle} text-primary hover:text-primary`,
  };

  return (
    <a
      href={href}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}
