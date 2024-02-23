import React from 'react';

const Select = ({ onChange }) => {
  const handleInputChange = (e) => {
    const newValue = e.target.value;

    onChange(newValue);
  };
  return (
    <>
      <div className="absolute right-6 top-6 text-[#3E5680] font-[500]">
        <select name="timeRange" id="timeRange" onChange={handleInputChange}>
          <option value="last-5-mins">Last 5 mins</option>
          <option value="last-10-mins">Last 10 mins</option>
          <option value="last-15-mins">Last 15 mins</option>
          <option value="last-30-mins">Last 30 mins</option>
          <option value="last-1-hour">Last 1 hour</option>
        </select>
      </div>
    </>
  );
};

export default Select;
