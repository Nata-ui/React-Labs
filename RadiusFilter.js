import React, { useState } from 'react';

const RadiusFilter = ({ onFilterChange }) => {
  const [minRadius, setMinRadius] = useState(0);
  const [maxRadius, setMaxRadius] = useState(Infinity);

  const handleMinRadiusChange = (event) => {
    setMinRadius(parseFloat(event.target.value));
    onFilterChange({ minRadius: parseFloat(event.target.value), maxRadius });
  };

  const handleMaxRadiusChange = (event) => {
    setMaxRadius(parseFloat(event.target.value));
    onFilterChange({ minRadius, maxRadius: parseFloat(event.target.value) });
  };

  return (
    <div>
      <label>
        Min Radius:
        <input
          type="number"
          value={minRadius}
          onChange={handleMinRadiusChange}
        />
      </label>
      <label>
        Max Radius:
        <input
          type="number"
          value={maxRadius}
          onChange={handleMaxRadiusChange}
        />
      </label>
    </div>
  );
};

export default RadiusFilter;