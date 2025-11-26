import React from "react";

export default function Button({ className, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-emerald-600 px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      {text}
    </button>
  );
}
