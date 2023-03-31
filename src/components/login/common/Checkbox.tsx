import React, { ChangeEvent, useState } from 'react';

export function CustomCheckbox() {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return (
    <label>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={handleCheckboxChange}
        style={{
          width: '24px',
          height: '24px',
          display: 'none',
        }}
      />
      <svg
        viewBox='0 0 24 24'
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: isChecked ? '#4CAF50' : '#E0E0E0',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isChecked && (
          <path
            fill='#FFFFFF'
            d='M9.5,19.4L4.9,14.8C4.5,14.4,4.5,13.8,4.9,13.4C5.3,13,5.9,13,6.3,13.4L10.5,17.6L17.7,10.3C18.1,9.9,18.7,9.9,19.1,10.3C19.5,10.7,19.5,11.3,19.1,11.7L11.8,19C11.4,19.4,10.9,19.4,10.5,19.4C10.1,19.4,9.6,19.4,9.5,19.4Z'
          />
        )}
      </svg>
    </label>
  );
}
