import React, { useState } from 'react';
import './styles.css';

const Admin = () => {
  const [selectedOption, setSelectedOption] = useState('admin');
  const [patValue, setPatValue] = useState('');

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handlePatChange = (event) => {
    setPatValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
   
  };

  return (
    <div>
      <form className="admin-form mt-5" onSubmit={handleSubmit}>
        <div className="admin-options">
          <button
            type="button"
            className={`admin-option ${selectedOption === 'admin' ? 'selected' : ''}`}
            onClick={() => handleOptionChange('admin')}
          >
            Admin
          </button>
          <button
            type="button"
            className={`admin-option ${selectedOption === 'pat' ? 'selected' : ''}`}
            onClick={() => handleOptionChange('pat')}
          >
            PAT
          </button>
        </div>

        {selectedOption === 'admin' ? (
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" />
          </div>
        ) : (
          <div>
            <label htmlFor="pat">PAT:</label>
            <input
              type="text"
              id="pat"
              value={patValue}
              onChange={handlePatChange}
            />
          </div>
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Admin;
