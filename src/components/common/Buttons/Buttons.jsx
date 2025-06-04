import React from 'react'

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

const colorClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
};

const Buttons = ({
  children,
  size = 'md',
  color = 'primary',
  className = '',
  ...rest
}) => {
  return (
    <button
      className={`rounded transition-colors focus:outline-none ${sizeClasses[size] || ''} ${colorClasses[color] || ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Buttons