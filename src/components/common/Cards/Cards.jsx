import React from 'react'

const Cards = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-gray-100 ${className}`}
      style={{
        boxShadow: '0 10px 20px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.10)',
        perspective: '1000px',
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Cards