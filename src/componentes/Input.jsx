import React from 'react';
import './Input.css'; // Import the CSS file for custom styles

const Input = ({ type, id, placeholder, value, onChange }) => {
  return (
    <div className="form-group">
      <input
        type={type}
        className="form-control form-control-user w-100"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
