import React from "react";

export default function Input({ type, placeholder, OnChange, id }) {
  return (
    <div className='w-full'>
      <input
        type={type}
        className='bg-blue-600 px-5 py-3 w-full'
        placeholder={placeholder}
        onChange={OnChange}
        id={id}
      />
    </div>
  );
}
