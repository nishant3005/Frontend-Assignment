import React from 'react';

const Log = ({ timestamp, message }) => {
  return (
    <div className="flex text-start text-[#5E7BAA] mb-4 font-logs font-[450]">
      <div className="mr-4 w-24">
        <span className="mr-2 h-[17px] w-[2px]">|</span>
        {new Date(timestamp).toLocaleTimeString()}
      </div>
      <div className="w-24">&#x0005B;info&#x0005D;</div>
      <div className="w-full text-[#A8C3E8]">{message}</div>
    </div>
  );
};

export default Log;
