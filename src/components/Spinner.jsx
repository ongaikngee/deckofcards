import React from "react";

const Spinner = ({
  size = "",
  colour = "",
  type = "spinner-grow",
}) => {
  return (
    <div className={`${type} ${colour} ${size}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
