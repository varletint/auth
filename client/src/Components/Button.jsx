import React from "react";

export default function Button({ className, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      {text}
    </button>
  );
}
