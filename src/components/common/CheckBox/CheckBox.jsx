import React from 'react'

const CheckBox = ({
  checked = false,
  onChange,
  label = '',
  name,
  ...rest
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        name={name}
        className="form-checkbox h-5 w-5 text-blue-600"
        {...rest}
      />
      <span className="ml-2 text-gray-700">{label}</span>
    </label>
  );
}

export default CheckBox