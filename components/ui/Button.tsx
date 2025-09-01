
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseClasses = 'font-bold rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-opacity-75 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-orange-600 focus-visible:ring-primary',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 focus-visible:ring-gray-400',
    accent: 'bg-accent text-white hover:bg-sky-600 focus-visible:ring-accent',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-5 text-base',
    lg: 'py-3 px-8 text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
