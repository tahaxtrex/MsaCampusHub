import React from 'react';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

function PhoneNumber({ value, onChange, name, error }) {
  return (
    <div className="w-full">
      <div className={`input validator border-2 rounded-xl flex items-center gap-2 p-2 ${error ? 'border-red-500' : 'border-green-800'} bg-white`}>
        <PhoneInput
          placeholder="Enter phone number"
          value={value}
          onChange={(phone) => onChange({ target: { name, value: phone } })}
          defaultCountry="DE"
          className="w-full outline-none bg-transparent"
        />
      </div>
      {error && <div className="text-red-600 text-sm mt-1 ml-1">{error}</div>}
      <style>{`
        .PhoneInputInput {
          background: transparent;
          outline: none;
          border: none;
        }
        .PhoneInputCountry {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default PhoneNumber;
