import React from 'react'

const Title = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold text-center my-6 ${className}`}>{children}</h1>
);

export default Title