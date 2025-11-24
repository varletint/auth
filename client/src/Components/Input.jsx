import React, { useState, forwardRef } from "react";
import { ViewIcon, ViewOffIcon } from "hugeicons-react";

const Input = forwardRef(({ type, placeholder, OnChange, id, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='w-full relative'>
      <input
        ref={ref}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 ${className}`}
        placeholder={placeholder}
        onChange={OnChange}
        id={id}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? <ViewIcon size={20} /> : <ViewOffIcon size={20} />}
        </button>
      )}
    </div>
  );
});

export default Input;
