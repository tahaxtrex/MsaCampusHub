import React from 'react'

function Username({ value, onChange, name }) {

  const getErrorMessage = (val) => {
    if (!val) return "";
    if (val.length < 3) return "Must be at least 3 characters";
    if (val.length > 30) return "Must be less than 30 characters";
    if (/\d/.test(val)) return "No numbers allowed";
    if (!/^[A-Za-z\s]*$/.test(val)) return "Only letters allowed";
    return "";
  };

  const errorMessage = getErrorMessage(value);

  return (
    <div>
      <label className={`input validator border-2 rounded-xl ${errorMessage ? 'border-red-500' : 'border-green-800'}`}>
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </g>
        </svg>
        <input
          type="text"
          required
          placeholder="Full name"
          value={value}
          onChange={onChange}
          name={name}
          className="w-full"
        />
      </label>
      {errorMessage && (
        <p className="text-red-600 text-sm mt-1 ml-1">
          {errorMessage}
        </p>
      )}
    </div>
  )
}

export default Username
