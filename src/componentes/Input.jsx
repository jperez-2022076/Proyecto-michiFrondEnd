import React, { useState } from 'react';
import './Input.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Input = ({ type, id, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <div className="input-group">
        <input
          type={showPassword ? 'text' : type} 
          className="form-control form-control-users"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {type === 'password' && (
          <span
            className="input-icon"
            onClick={() => setShowPassword(!showPassword)}  
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
