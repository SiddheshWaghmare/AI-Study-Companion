import React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => (
  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <input type="checkbox" {...props} />
    {label && <span>{label}</span>}
  </label>
);

export default Checkbox;
