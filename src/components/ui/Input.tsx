import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <input
        style={{
          padding: '8px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: 4,
          width: '100%',
        }}
        {...props}
      />
      {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
    </div>
  );
};

export default Input;
