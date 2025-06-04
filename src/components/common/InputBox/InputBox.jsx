import React from 'react'

const InputBox = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 mb-2" htmlFor={name}>{label}</label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...rest}
      />
    </div>
  );
}

export default InputBox