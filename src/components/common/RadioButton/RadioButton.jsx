import React from 'react'

const RadioButton = ({
  checked = false,
  onChange,
  label = '',
  name,
  value,
  ...rest
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        name={name}
        value={value}
        className="form-radio h-5 w-5 text-blue-600"
        {...rest}
      />
      <span className="ml-2 text-gray-700">{label}</span>
    </label>
  );
}

export default RadioButton