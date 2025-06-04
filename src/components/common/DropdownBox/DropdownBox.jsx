import React from 'react'

const DropdownBox = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 mb-2" htmlFor={name}>{label}</label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option, idx) => (
          <option key={idx} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export default DropdownBox