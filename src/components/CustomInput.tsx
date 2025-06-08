import React from 'react';

// Custom Input Component
const CustomInput = ({
    type,
    placeholder,
    value,
    onChange,
    icon,
    required = false,
    autoComplete,
    id,
    name
}: any) => (
    <div className="relative group">
        <input
            id={id}
            name={name}
            type={type}
            required={required}
            autoComplete={autoComplete}
            className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 ease-in-out peer"
            placeholder=" "
            value={value}
            onChange={onChange}
        />
        <label
            htmlFor={id}
            className="absolute left-4 top-4 text-gray-400 text-sm transition-all duration-300 ease-in-out peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:top-1 peer-valid:text-xs peer-valid:text-gray-600"
        >
            {placeholder}
        </label>
        {icon && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300">
                {icon}
            </div>
        )}
    </div>
);

export default CustomInput; 