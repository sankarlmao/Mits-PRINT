// GreenSpinner.jsx
import React from "react";

const GreenSpinner = ({ size = 40 }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `${size * 0.2}px solid #c8f7c5`,
    borderTop: `${size * 0.2}px solid #22c55e`, // green
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <>
      <div style={spinnerStyle} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default GreenSpinner;
